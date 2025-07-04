import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  padding: 40px;
  color: white;
  background-color: #121212;
  min-height: 100vh;
`;

const UploadBox = styled.div`
  background: #1f1f1f;
  padding: 30px;
  border-radius: 16px;
  max-width: 600px;
  margin: auto;
  text-align: center;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 18px;
  background-color: #ae76b6;
  border: none;
  color: white;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
`;

const CodeBlock = styled.pre`
  margin-top: 30px;
  background: #282c34;
  color: #61dafb;
  padding: 20px;
  border-radius: 10px;
  text-align: left;
  white-space: pre-wrap;
`;

const ConvertPage = () => {
  const [file, setFile] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please upload a DOCX file.");

    const formData = new FormData();
    formData.append('docxFile', file);

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/generate', formData);
      setCode(res.data.code);
      setDownloadLink(res.data.downloadLink);
    } catch (err) {
      alert("Failed to generate code.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Container>
      <UploadBox>
        <h2>Upload Mission DOCX File</h2>
        <input type="file" accept=".docx" onChange={handleFileChange} />
        <Button onClick={handleUpload}>
          {loading ? 'Processing...' : 'Generate C Code'}
        </Button>

        {code && (
          <>
            <h3 style={{ marginTop: '30px' }}>Generated C Code</h3>
            <CodeBlock>{code}</CodeBlock>
          </>
        )}

        {downloadLink && (
          <div style={{ marginTop: '20px' }}>
            ✅ C code generated!{' '}
            <a
              href={downloadLink}
              download
              style={{ color: '#8fd0f8', textDecoration: 'underline' }}
            >
              Download it here
            </a>
          </div>
        )}
      </UploadBox>
    </Container>
  );
};

export default ConvertPage;
