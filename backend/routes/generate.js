const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

router.post('/', async (req, res) => {
  try {
    if (!req.files || !req.files.docxFile) {
      return res.status(400).send('No file uploaded');
    }

    const docx = req.files.docxFile;

    // Define file paths
    const uploadPath = path.join(__dirname, '../uploads', docx.name);
    const outputPath = path.join(__dirname, '../output/generated_mission_code.c');
    const parserScript = path.join(__dirname, '../scripts/mission_parser.py');

    // Save the uploaded DOCX file
    await docx.mv(uploadPath);

    // Run mission_parser.py (which internally runs c_code_generation.py)
    exec(`python3 "${parserScript}" "${uploadPath}"`, (err, stdout, stderr) => {
      console.log('📄 Parser + Codegen Output:\n', stdout);

      if (err) {
        console.error('❌ Error running mission_parser.py:', stderr || err.message);
        return res.status(500).send('Parser or code generation error:\n' + (stderr || err.message));
      }

      // Ensure the C file was generated
      if (!fs.existsSync(outputPath)) {
        return res.status(500).send('Code generation completed, but .c file not found.');
      }

      // Read and return the generated code with a download link
      const code = fs.readFileSync(outputPath, 'utf-8');
      res.send({
        code,
        downloadLink: 'http://localhost:5000/download/generated_mission_code.c'
      });
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
