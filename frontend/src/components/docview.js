import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Document, Page } from 'react-pdf';
import Navbar from './navbar'; // Import Navbar

// Animation for the floating elements
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #000000;  /* Solid black background for entire page */
  padding-top: 40px;   /* Give space for fixed navbar */
`;
// Styled Components
const DocumentationContainer = styled.div`
  max-width: 1400px;
  margin: 40px auto;
  padding: 60px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(15, 15, 15, 0.95) 100%);
  border-radius: 32px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(174, 118, 182, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
    z-index: -1;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
  position: relative;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  background: linear-gradient(90deg, #ae76b6, #ffb3cc);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
  font-weight: 800;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 40px;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const TOCWrapper = styled.div`
  flex: 0 0 300px;
  position: sticky;
  top: 40px;
  height: fit-content;
  background: linear-gradient(135deg, rgba(46, 46, 46, 0.3) 0%, rgba(28, 28, 28, 0.5) 100%);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const TOCTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #ae76b6;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '📋';
    font-size: 1.2rem;
  }
`;

const TOCList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TOCItem = styled(motion.li)`
  margin-bottom: 12px;
  position: relative;
  padding-left: 24px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    background: #ae76b6;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  a {
    color: ${({ active }) => active ? '#ffffff' : 'rgba(169, 139, 139, 0.7)'};
    text-decoration: none;
    font-weight: ${({ active }) => active ? '600' : '400'};
    display: block;
    padding: 8px 12px;
    border-radius: 8px;
    background: ${({ active }) => active ? 'rgba(174, 118, 182, 0.15)' : 'transparent'};
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
      background: rgba(174, 118, 182, 0.1);
    }

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: ${({ active }) => active ? '100%' : '0'};
      height: 2px;
      background: linear-gradient(90deg, #ae76b6, #ffb3cc);
      transition: width 0.3s ease;
    }
  }
`;

const DocumentViewer = styled.div`
  flex: 1;
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%);
  border-radius: 20px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  min-height: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Placeholder = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2rem;
`;

const DownloadButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #8a5a91, #ae76b6);
  color: white;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  margin-top: 40px;
  box-shadow: 0 10px 20px rgba(138, 90, 145, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #ae76b6, #8a5a91);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(138, 90, 145, 0.4);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(1px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const FloatingOrb = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(174, 118, 182, 0.2) 0%, rgba(174, 118, 182, 0) 70%);
  border-radius: 50%;
  animation: ${floatAnimation} 8s ease-in-out infinite;
  z-index: -1;
`;

const DocumentationViewer = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [numPages, setNumPages] = useState(null);
  
  // Sample table of contents - replace with your actual document structure
  const toc = [
    { id: 'introduction', title: 'Introduction', icon: '📖' },
    { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
    { id: 'features', title: 'Features Overview', icon: '✨' },
    { id: 'configuration', title: 'Configuration', icon: '⚙️' },
    { id: 'api-reference', title: 'API Reference', icon: '🔌' },
    { id: 'examples', title: 'Examples', icon: '🧩' },
    { id: 'faq', title: 'FAQ', icon: '❓' },
  ];

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <>
    <Navbar/>
    <PageWrapper>

    <DocumentationContainer>
      <FloatingOrb style={{ top: '10%', left: '10%', animationDelay: '0s' }} />
      <FloatingOrb style={{ top: '60%', right: '10%', animationDelay: '1s', width: '300px', height: '300px' }} />
      <FloatingOrb style={{ bottom: '10%', left: '20%', animationDelay: '2s' }} />
      
      <Header>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Project Documentation
        </Title>
        <Subtitle>
          Comprehensive guide to using our platform and all its features
        </Subtitle>
      </Header>

      <ContentWrapper>
        <TOCWrapper>
          <TOCTitle>Table of Contents</TOCTitle>
          <TOCList>
            {toc.map((item) => (
              <TOCItem 
                key={item.id}
                active={activeSection === item.id}
                onClick={() => setActiveSection(item.id)}
                whileHover={{ x: 5 }}
              >
                <a href={`#${item.id}`}>
                  <span style={{ marginRight: '10px' }}>{item.icon}</span>
                  {item.title}
                </a>
              </TOCItem>
            ))}
          </TOCList>
        </TOCWrapper>

        <DocumentViewer>
          {/* Replace this with your actual document viewer */}
          <Placeholder>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.5, marginBottom: '20px' }}>
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#ae76b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="#ae76b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 13H8" stroke="#ae76b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17H8" stroke="#ae76b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 9H9H8" stroke="#ae76b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>Document content would be displayed here</p>
            <p>Select a section from the table of contents</p>
          </Placeholder>

          {/* If using react-pdf for PDF documents */}
          {/* <Document
            file="/documentation.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={1} />
          </Document> */}
        </DocumentViewer>
      </ContentWrapper>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <DownloadButton
          href="/documentation.pdf" // Replace with your actual docx/pdf file
          download="Project_Documentation.pdf"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Download Full Documentation
        </DownloadButton>
      </div>
    </DocumentationContainer>
    </PageWrapper>
    </>
  );
};

export default DocumentationViewer;