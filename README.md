# 🛠️ C Code Generator for DRDO Mission Sequences

A Python-based automation tool that parses DRDO mission documents (DOCX/JSON) and generates clean, structured, and annotation-rich C code. Designed to speed up embedded firmware development for mission-critical systems by transforming logical event sequences into compilable source files.

---

## 🚀 Features

- ✅ **Automatic Extraction** of mission logic (`IF condition ➝ THEN action`)
- 🧠 **DIP/DOP Flag Handling** with macro generation
- 🔧 **Placeholder C Functions** for all parsed actions
- 📂 **Modular Output:** `.h` and `.c` files with headers, macros, and logic blocks
- 📌 **Readable & Maintainable Code:** Annotated, formatted, and ready for integration

---

## 📂 Input Formats

- `.docx` — Mission sequence event charts
- `.json` — Structured logic/event input (alternate mode)

---

## 📦 Output

- `mission_control.c` — Main logic implementation
- `mission_control.h` — Declarations and macro definitions
- `event_table.c/h` — Auto-generated condition-action handlers
- `utils.h` — Placeholder logic functions
- `README_GENERATED.md` — Summary of parsed logic

---

## 🛠 Tech Stack

- **Language:** Python 3.10+
- **Libraries:** `python-docx`, `jinja2`, `json`, `re`, `os`, `argparse`
- **Target Code:**  C style

---

## 🧪 Sample Command

```bash
python3 mission_parser.py --input mission.docx --output ./generated_code/
