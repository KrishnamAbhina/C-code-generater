import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Input = styled.input`
  margin-top: 10px;
`;

const Button = styled.button`
  background: #ae76b6;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 20px;
  margin-top: 16px;
  cursor: pointer;

  &:hover {
    background: #945b9e;
  }
`;

const FileUpload = ({ setParsedData, setGeneratedCode }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Upload a file first!");
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData);
      setParsedData(res.data.parsed);
      setGeneratedCode(res.data.generated);
    } catch (err) {
      alert("Upload failed.");
    }
  };

  return (
    <div>
      <label>Choose Mission DOCX</label>
      <Input type="file" accept=".docx" onChange={(e) => setFile(e.target.files[0])} />
      <Button onClick={handleUpload}>Upload & Parse</Button>
    </div>
  );
};

export default FileUpload;
