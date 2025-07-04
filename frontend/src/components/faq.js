import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from './themecontext';

const FAQContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 40px;
  background-color: #121212;
`;

const FAQTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 40px;
  background: linear-gradient(90deg,rgb(152, 105, 159), #ae76b6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
`;

const FAQSection = styled.section`
  margin-bottom: 50px;
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #ae76b6;
`;

const Question = styled.div`
  background: rgba(30, 30, 30, 0.8);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  border-left: 4px solid #ae76b6;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

const QuestionTitle = styled.h4`
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #ffffff;
`;

const Answer = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
`;

const LimitationItem = styled.li`
  margin-bottom: 10px;
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
`;

const SampleInputLink = styled.a`
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #8a5a91, #ae76b6);
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.4);
  }
`;

const FAQ = () => {
  return (
    <FAQContainer>
      <FAQTitle>Frequently Asked Questions</FAQTitle>
      
      <FAQSection>
        <SectionTitle>Edge Cases Handled</SectionTitle>
        
        <Question>
          <QuestionTitle>Inline DOP groupings like A6,A7(N), B6,B7(R) (ON)</QuestionTitle>
          <Answer>
            We've added logic to extract multiple DOP groups and apply the common status.
          </Answer>
        </Question>
        
        <Question>
          <QuestionTitle>Unicode decode issues during file reading</QuestionTitle>
          <Answer>
            Handled by explicitly reading .json files with encoding='utf-8' to avoid UnicodeDecodeError.
          </Answer>
        </Question>
        
        <Question>
          <QuestionTitle>Variables with Subscripts, Superscripts, or Greek Letters</QuestionTitle>
          <Answer>
            Introduced a normalization module to map subscripts/superscripts and Greek symbols to ASCII equivalents:
            <ul>
              <LimitationItem>T₀ → T0</LimitationItem>
              <LimitationItem>α → alpha</LimitationItem>
            </ul>
          </Answer>
        </Question>
        
        <Question>
          <QuestionTitle>Chained Flag Assignments Within Logic</QuestionTitle>
          <Answer>
            Flags such as <code>flagY = flagA && flagB</code> embedded within logic were overlooked. 
            Added logic to detect and separate flag assignments, ensuring they're handled properly in C output 
            and initialized independently.
          </Answer>
        </Question>
      </FAQSection>
      
      <FAQSection>
        <SectionTitle>Critical Limitations</SectionTitle>
        
        <Question>
          <QuestionTitle>PDF Conversion Data Loss</QuestionTitle>
          <Answer>
            <ul>
              <LimitationItem>
                <strong>Table Structure Loss:</strong> Complex table layouts may be corrupted or simplified
              </LimitationItem>
              <LimitationItem>
                <strong>Text Formatting Loss:</strong> Superscripts, subscripts, and special characters may be altered
              </LimitationItem>
              <LimitationItem>
                <strong>Spatial Relationships:</strong> Precise positioning of elements is not preserved
              </LimitationItem>
              <LimitationItem>
                <strong>Mathematical Expressions:</strong> Complex formulas may be broken or misinterpreted
              </LimitationItem>
              <LimitationItem>
                <strong>Image/Diagram Loss:</strong> Embedded graphics and diagrams may be lost or distorted
              </LimitationItem>
            </ul>
          </Answer>
        </Question>
      </FAQSection>
      
      <FAQSection>
        <SectionTitle>Sample Input</SectionTitle>
        <Question>
          <QuestionTitle>Need an example of input format?</QuestionTitle>
          <Answer>
            Download our sample input document to see the expected format and structure.
            <br/>
            <SampleInputLink 
              href="/DRDOMSD_1.docx" 
              download="DRDOMSD_1.docx"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download Sample Input
            </SampleInputLink>
          </Answer>
        </Question>
      </FAQSection>
    </FAQContainer>
  );
};

export default FAQ;