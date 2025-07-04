const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const generateRoutes = require('./routes/generate');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Serve static files from output folder
app.use('/download', express.static(path.join(__dirname, 'output')));

app.use('/api/generate', generateRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
