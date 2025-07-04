import React from 'react';

const ParsedOutput = ({ data }) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <h3>🧩 Parsed Mission Logic</h3>
      <pre style={{ background: '#f0f0f0', padding: '10px' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default ParsedOutput;
