# Final C Code
import json
import re
import tkinter as tk
from tkinter import filedialog
import sys


# === Local file selection ===
def select_json_file():
    root = tk.Tk()
    root.withdraw()
    file_path = filedialog.askopenfilename(
        title="Select Parsed Mission Logic JSON File",
        filetypes=[("JSON files", "*.json")]
    )
    return file_path


def extract_functions_from_conditions(data):
    functions = set()
    for entry in data:
        logic = entry["logic"]
        for v in logic.values():
            if isinstance(v, str) and "()" in v:
                functions.add(v.split("(")[0])
    return functions

def is_dip_related_function(func_name):
    return "dip" in func_name.lower()

def extract_variables_from_conditions(data):
    pattern = r'[a-zA-Z_][a-zA-Z0-9_]*'
    function_pattern = re.compile(r'\b[a-zA-Z_][a-zA-Z0-9_]*\s*\(\s*\)')
    float_vars = set()
    int_vars = set()

    for entry in data:
        # Extract from logic conditions
        for key, value in entry["logic"].items():
            if key.startswith("condition") and isinstance(value, str):
                if function_pattern.search(value):
                    continue
                matches = re.findall(pattern, value)
                for match in matches:
                    if match not in ["if", "else", "for", "while", "return", "and", "or", "ON", "OFF"]:
                        float_vars.add(match)

        # Extract from flags (assigned variables)
        flags = entry.get("dop_dip", {}).get("flags", "NIL")
        if flags != "NIL" and isinstance(flags, list):
            for flag in flags:
                if "=" in flag:
                    lhs, rhs = flag.split("=")
                    lhs = lhs.strip()
                    rhs_vars = re.findall(pattern, rhs)
                    int_vars.add(lhs)
                    for rv in rhs_vars:
                        if rv not in ["if", "else", "for", "while", "return", "and", "or", "ON", "OFF"]:
                            # Assume rhs variables in flag assignments are int too
                            int_vars.add(rv)

        flags_inside = entry.get("logic", {}).get("flags_inside", "NIL")
        if flags_inside != "NIL" and isinstance(flags_inside, list):
            for flag in flags_inside:
                if "=" in flag:
                    lhs, rhs = flag.split("=")
                    lhs = lhs.strip()
                    rhs_vars = re.findall(pattern, rhs)
                    int_vars.add(lhs)
                    for rv in rhs_vars:
                        if rv not in ["if", "else", "for", "while", "return", "and", "or", "ON", "OFF"]:
                            # Assume rhs variables in flag assignments are int too
                            int_vars.add(rv)

    # Remove T and duplicates across sets
    float_vars.discard("T")
    int_vars.discard("T")
    float_vars = float_vars - int_vars

    return float_vars, int_vars


def convert_to_c_operator(op):
    return op.replace("*", "").replace("and", "&&").replace("or", "||")

def wrap_c_multiline_comment(text, width=80):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        if len(current) + len(word) + 1 <= width:
            current += " " + word if current else word
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    wrapped = "/*\n"
    for line in lines:
        wrapped += f"* {line}\n"
    wrapped += "*/"
    return wrapped


def generate_condition(logic_block):
    """
    Builds a C-compatible logical condition string using operator precedence from logic_block.
    Adds brackets based on nesting level to preserve correct evaluation order.
    """
    def wrap_level(expr, level):
        return f"({expr})" if level > 1 else expr

    parts = []
    i = 1
    while f"condition{i}" in logic_block:
        cond = logic_block[f"condition{i}"]
        cond = re.sub(r'/\*.*?\*/', '', cond).strip()
        parts.append({'type': 'condition', 'value': cond})
        op_key = f"operator{i}"
        if op_key in logic_block:
            op = logic_block[op_key]
            parts.append({'type': 'operator', 'value': convert_to_c_operator(op), 'level': op.count("*") + 1})
        i += 1

    # Now group with respect to precedence (level)
    while True:
        max_level = max((p.get('level', 1) for p in parts if p['type'] == 'operator'), default=1)
        if max_level == 0:
            break
        new_parts = []
        i = 0
        while i < len(parts):
            if parts[i]['type'] == 'operator' and parts[i]['level'] == max_level:
                left = new_parts.pop()
                op = parts[i]
                right = parts[i + 1]
                combined = f"{wrap_level(left['value'], max_level)} {op['value']} {wrap_level(right['value'], max_level)}"
                new_parts.append({'type': 'condition', 'value': combined})
                i += 2
            else:
                new_parts.append(parts[i])
                i += 1
        parts = new_parts
        if all(p['type'] == 'condition' for p in parts):
            break

    final = parts[0]['value'] if parts else ""
    final = re.sub(r'\bT\b', 'timeFlight', final)  # Replace standalone T with timeFlight
    return final


def parse_dop_array(dop_str):
    if dop_str == "NIL":
        return []
    return [x.strip() for x in dop_str.split(",")]

def generate_macro_definitions(macros):
    lines = []
    for name, value in sorted(macros.items()):
        lines.append(f"#define {name} {value}")
    return "\n".join(lines)

def generate_c_code_from_json(json_data):
    data = json.loads(json_data)
    # Replace standalone T with timeFlight
    json_data = re.sub(r'\bT\b', 'timeFlight', json_data)
    json_data = re.sub(r'\bT(\w+)', r'time\1', json_data)
    data = json.loads(json_data)

    original_functions = extract_functions_from_conditions(data)
    float_vars, int_vars = extract_variables_from_conditions(data)

    function_mapping = {}
    function_comments = {}  #function_name -> inline comment (if any)

    cases = ""
    time_variables = ""
    time_inits = ""
    declared_vars = set()
    placeholder_functions = []
    macro_definitions = {}

    for idx, entry in enumerate(data):
        event_num = int(entry["Event Number"][1:])
        logic = entry["logic"]
        dop_dip = entry["dop_dip"]

        # Check if this event needs a null command
        issue_null_command = dop_dip.get("issueNullCommand", "no").lower() == "yes"

        #Extract functions and their inline comments from this event
        for k, v in logic.items():
            if k.startswith("condition") and isinstance(v, str):
                matches = re.findall(r'\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(\s*\)', v)
                for func in matches:
                    comment_match = re.search(r'/\*\s*(.*?)\s*\*/', v)
                    if comment_match:
                        function_comments[func] = comment_match.group(1)

        # Extract used functions in this event
        logic_strs = [v for k, v in logic.items() if k.startswith("condition") and isinstance(v, str)]
        used_funcs_in_event = set()
        for s in logic_strs:
            matches = re.findall(r'\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(\s*\)', s)
            used_funcs_in_event.update(matches)

        for func in used_funcs_in_event:
            function_mapping[func] = func  # No shortening needed, use as-is


        flags = dop_dip.get("flags", "NIL")
        flags_inside = logic.get("flags_inside", "NIL")
        flag_assignments = []
        if flags != "NIL" and isinstance(flags, list):
            for flag in flags:
                if "=" in flag:
                    var, value = flag.split("=")
                    flag_assignments.append(f"                {var.strip()} = {value.strip()};")

        flag_inside_assignments = []
        if flags_inside != "NIL" and isinstance(flags_inside, list):
            for flag in flags_inside:
                if "=" in flag:
                    var, value = flag.split("=")
                    flag_inside_assignments.append(f"        {var.strip()} = {value.strip()};")

        condition = generate_condition(logic)
        for orig_func, new_func in function_mapping.items():
            if orig_func + "()" in condition:
                condition = condition.replace(orig_func + "()", new_func + "()")

        dop_n_list = parse_dop_array(dop_dip.get("dop_n", "NIL"))
        dop_r_list = parse_dop_array(dop_dip.get("dop_r", "NIL"))

        dop_init_lines = []
        dop_list = []
        dop_value_index = 0

        for d in dop_n_list:
            dop_init_lines.append(f"                dopValues[{dop_value_index}] = {d};  ")
            dop_list.append(d)
            dop_value_index += 1
        for d in dop_r_list:
            dop_init_lines.append(f"                dopValues[{dop_value_index}] = {d};  ")
            dop_list.append(d)
            dop_value_index += 1

        time_var = entry.get("time_assignment", f"T{event_num}")
        if time_var not in declared_vars:
            time_variables += f"float {time_var};\n"
            time_inits += f"    {time_var} = 0.0;\n"
            declared_vars.add(time_var)

        bus = dop_dip.get("busno", "0")
        subsys = dop_dip.get("subsys", "0")

        if bus.startswith("bus_"):
            macro_definitions[bus.upper()] = bus.split("_")[-1]
            bus = bus.upper()
        else:
            bus = f'"{bus}"'

        if subsys.startswith("ss"):
            macro_definitions[subsys.upper()] = subsys[2:]
            subsys = subsys.upper()
        else:
            subsys = f'"{subsys}"'

        status = dop_dip.get("status_n", "NIL") if dop_dip.get("status_n", "NIL") != "NIL" else dop_dip.get("status_r", "NIL")

        misseqdop_call = ""
        if dop_list and status != "NIL":
            misseqdop_call = f"                misSeqDop({bus}, {subsys}, {len(dop_list)}, dopNos, {status});"

        flag_code = "\n".join(flag_assignments)
        flag_inside_code = "\n".join(flag_inside_assignments)
        dop_init = "\n".join(dop_init_lines)

        # Add null command if needed
        null_command_code = ""
        if issue_null_command:
            null_func_name = f"issueNullCommand{event_num}"
            null_command_code = f"                {null_func_name}();\n"

        raw_desc = entry.get("event_description", "").replace("*/", "").strip()
        event_desc_comment = wrap_c_multiline_comment(f"Event Description: {raw_desc}")
        case_template = f"""
        {event_desc_comment}
        case {event_num}:
          {flag_inside_code}
            if ({condition}) {{
{null_command_code}{flag_code}
{dop_init}
{misseqdop_call}
                {time_var} = timeFlight;
                event = {event_num};
            }}
            break;
"""
        cases += case_template

        for func in used_funcs_in_event:
            func_name = function_mapping[func]
            existing = [f.split(" ")[2].split("(")[0] for f in placeholder_functions]
            if func_name not in existing:
                comment_text = function_comments.get(func, f"TODO: Implement logic for {func_name}")
                if is_dip_related_function(func):
                    placeholder = f"""
/* {func_name}
 * Purpose: {comment_text}
 */
bool {func_name}() {{
    // {comment_text}
    // return 1;
}}"""
                else:
                    placeholder = f"""
/* {func_name}
 * Purpose: {comment_text}
 */
int {func_name}() {{
    // {comment_text}
    // return 1;
}}"""
                placeholder_functions.append(placeholder)

    defined_functions = set([f.split(" ")[2].split("(")[0] for f in placeholder_functions])
    used_functions = set(function_mapping.values())

    # Collect and declare issueNullCommandX for each event that needs it
    null_command_funcs = []
    for entry in data:
        if entry.get("dop_dip", {}).get("issueNullCommand", "no").lower() == "yes":
            ev = int(entry["Event Number"][1:])
            func_name = f"issueNullCommand{ev}"
            used_functions.add(func_name)
            null_command_funcs.append(f"""
        /* {func_name}
        * Purpose: Issue null command to actuators for event {ev}
        */
        void {func_name}() {{
            // TODO: Implement null command logic for event {ev}
        }}""")
    placeholder_functions.extend(null_command_funcs)

    function_prototypes_lines = []
    for func in sorted(used_functions):
        comment = ""
        if func not in defined_functions and func != "issueNullCommand":
            comment = " // TODO: Define this function - currently only declared"
        if func == "issueNullCommand":
            function_prototypes_lines.append(f"void {func}();")
        else:
            function_prototypes_lines.append(f"int {func}();{comment}")
    function_prototypes = "\n".join(function_prototypes_lines)

    time_var_names = {var_line.strip().split()[1].replace(";", "") for var_line in time_variables.strip().splitlines()}

    float_vars = sorted(float_vars - time_var_names)
    int_vars = sorted(int_vars - time_var_names)
    vars_code = "\n".join([f"float {v};" for v in float_vars] + [f"int {v};" for v in int_vars])
    float_vars, int_vars = extract_variables_from_conditions(data)
    variables = float_vars.union(int_vars)

    interface_assignments = "\n".join([f"    // {v} = external_{v};" for v in sorted(variables)])

    ifdef_declarations = "\n".join(
        [f"extern float {v};" for v in float_vars] +
        [f"extern int {v};" for v in int_vars]
    )

    macro_block = generate_macro_definitions(macro_definitions)

    main_template = f"""#define ON 1
#define OFF 0
#define unsigned short int WORD
#define EXTERNVAR
#define LOCALVAR

{macro_block}

/* Declare all required variables */
int event;
{time_variables}
{vars_code}

/* Function prototypes */
{function_prototypes}

/* Placeholder functions for condition checks */
{''.join(placeholder_functions)}

void interface() {{
{interface_assignments}
}}

void init_timevar() {{
    event = 1;
    timeFlight = 0.0;
{time_inits}}}

#ifdef EXTERNVAR
{ifdef_declarations}
#endif

void misSeq() {{
    WORD dopNos[10];
    WORD dopValues[10];
    interface();

    switch(event) {{
{cases}        default:
            break;
    }}
}}"""

    return main_template


# --- Maiimport sys

if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            print("❌ No JSON file path provided.")
            exit()

        filename = sys.argv[1]  # Get JSON path from backend

        # Read JSON and generate C code
        with open(filename, "r", encoding="utf-8") as f:
            json_data = f.read()

        generated_code = generate_c_code_from_json(json_data)

        # Save output
        output_filename = "output/generated_mission_code.c"
        with open(output_filename, "w") as f:
            f.write(generated_code)

        print(generated_code)  # ✅ Send this to backend
        print(f"✅ C code generated and saved to: {output_filename}")

    except Exception as e:
        print(f"❌ Error: {e}")
