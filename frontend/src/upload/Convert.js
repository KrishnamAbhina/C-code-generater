import React, { useState } from 'react';
import styled from 'styled-components';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import Navbar from '../components/navbar';

function Convert() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [code, setCode] = useState('');
  const [downloadLink, setDownloadLink] = useState('');

  const handleDrop = async (files) => {
    if (files.length === 0) return;
    const file = files[0];

    const formData = new FormData();
    formData.append('docxFile', file);

    setUploading(true);
    setProgress(0);

    try {
      const uploadInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(uploadInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);

      const res = await axios.post('http://localhost:5000/api/generate', formData);

      clearInterval(uploadInterval);
      setProgress(100);
      setCode(res.data.code);
      setDownloadLink(res.data.downloadLink);
    } catch (error) {
      console.error(error);
      alert('❌ Error uploading file.');
      setUploading(false);
    }
  };

  const handleReset = () => {
    setUploading(false);
    setProgress(0);
    setCode('');
    setDownloadLink('');
  };

  return (
    <Wrapper>
      <Navbar />
      <Container>
        {uploading ? (
          <ProgressBox>
            <h2>Converting document to C code...</h2>
            <ProgressBar>
              <Progress style={{ width: `${progress}%` }} />
            </ProgressBar>
            <p>
              Estimated time remaining:{' '}
              {Math.max(0, Math.ceil((100 - progress) / 10))} sec
            </p>

            {code && (
              <>
                <h3 style={{ marginTop: '30px' }}>Generated C Code</h3>
                <CodeBlock>{code}</CodeBlock>

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
              </>
            )}

            <ResetBtn onClick={handleReset}>Reset</ResetBtn>
          </ProgressBox>
        ) : (
          <>
          <br/><br/>
            <Title>Convert your DOCX Mission File</Title>
            <Dropzone onDrop={handleDrop}>
              {({ getRootProps, getInputProps }) => (
                <DropArea {...getRootProps()}>
                  <input {...getInputProps()} />
                  <h3>Drag & Drop your file here</h3>
                  <p>or click to select a file</p>
                  <UploadBtn>Select File</UploadBtn>
                </DropArea>
              )}
            </Dropzone>
          </>
        )}
      </Container>
    </Wrapper>
  );
}

// ========== Styled Components ==========

const Wrapper = styled.div`
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(15, 15, 15, 0.95) 100%);
  min-height: 100vh;
  color: white;
  font-family: 'Segoe UI', sans-serif;
`;

const Container = styled.div`
  padding: 60px 20px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;
`;

const DropArea = styled.div`
  border: 2px dashed #888;
  padding: 40px;
  border-radius: 12px;
  background: #1c1c1c;
  max-width: 600px;
  margin: 0 auto;
`;

const UploadBtn = styled.button`
  margin-top: 12px;
  padding: 10px 24px;
  background:linear-gradient(135deg, #8a5a91, #ae76b6);;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
`;

const ResetBtn = styled.button`
  margin-top: 20px;
  padding: 10px 24px;
  background: #444;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
`;

const ProgressBox = styled.div`
  margin-top: 100px;
`;

const ProgressBar = styled.div`
  background: #222;
  width: 60%;
  margin: 20px auto;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background: #7c3aed;
  transition: width 0.3s ease-in-out;
`;

const CodeBlock = styled.pre`
  margin-top: 30px;
  background: #282c34;
  color: #61dafb;
  padding: 20px;
  border-radius: 10px;
  text-align: left;
  white-space: pre-wrap;
  max-width: 700px;
  margin: 30px auto;
`;

export default Convert;
