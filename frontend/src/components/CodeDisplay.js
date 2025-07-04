import React from 'react';

const CodeDisplay = ({ code }) => {
  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'generated_code.c';
    link.click();
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>💻 Generated C Code</h3>
      <pre style={{ background: '#e0f7fa', padding: '10px', overflowX: 'auto' }}>{code}</pre>
      <button onClick={handleDownload}>Download .c File</button>
    </div>
  );
};

export default CodeDisplay;
