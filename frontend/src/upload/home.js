import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';

// ========== Animations ==========
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(174, 118, 182, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(174, 118, 182, 0); }
  100% { box-shadow: 0 0 0 0 rgba(174, 118, 182, 0); }
`;

const typewriter = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

const blinkCaret = keyframes`
  from, to { border-color: transparent }
  50% { border-color: #ae76b6 }
`;

// ========== Styled Components ==========
const Wrapper = styled.div`
  background: linear-gradient(135deg,rgb(31, 29, 29) 0%, #1a1a1a 100%);
  min-height: 100vh;
  color: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
`;

const LayoutContainer = styled.div`
  display: flex;
  position: relative;
`;

const Hero = styled.section`
  position: relative;
  margin: 40px auto;
  padding: 80px 40px;
  max-width: 1400px;
  border-radius: 32px;
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(15, 15, 15, 0.9) 100%);
 
  display: flex;
  flex-direction: column;
  gap: 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
  z-index: 1;

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

  @media (max-width: 1024px) {
    padding: 60px 30px;
    margin: 20px;
  }
`;

const HeroContent = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeroText = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 16px;
  background: linear-gradient(90deg, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    text-align: center;
  }
`;

const SubText = styled.p`
  font-size: 1.3rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
  max-width: 600px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
`;

const CodePreview = styled.div`
  flex: 1;
  background: #1e1e1e;
  border-radius: 16px;
  padding: 30px;
  font-family: 'Fira Code', monospace;
  color: #f8f8f2;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Section = styled.section`
  padding: 100px 40px;
  position: relative;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  margin-bottom: 40px;
  background: linear-gradient(90deg, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60%;
    height: 4px;
    background: linear-gradient(90deg, #ae76b6, #ffb3cc);
    border-radius: 2px;
  }
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  max-width: 900px;
  margin-bottom: 30px;
`;

const Highlight = styled.span`
  color: #ae76b6;
  font-weight: 600;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 50px;
`;

const FeatureCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(46, 46, 46, 0.3) 0%, rgba(28, 28, 28, 0.5) 100%);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    border-color: rgba(174, 118, 182, 0.3);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ae76b6, #8a5a91);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: white;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
`;

const CtaSection = styled(Section)`
  text-align: center;
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%);
  border-radius: 32px;
  margin: 60px auto;
  max-width: 1200px;
  padding: 80px 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(144, 207, 255, 0.05) 0%, rgba(0, 0, 0, 0) 70%);
    z-index: -1;
    animation: ${floatAnimation} 15s infinite alternate;
  }
`;

const CtaTitle = styled.h2`
  font-size: 2.8rem;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #ae76b6, #ffb3cc);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
`;

const CtaButton = styled(motion.button)`
  background: linear-gradient(135deg, #ae76b6, #8a5a91);
  border: none;
  padding: 18px 36px;
  border-radius: 30px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 30px;
  box-shadow: 0 10px 20px rgba(174, 118, 182, 0.3);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: ${pulseAnimation} 2s infinite;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(174, 118, 182, 0.4);
  }

  &:active {
    transform: translateY(1px);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover::after {
    transform: translateX(100%);
  }

  @media (max-width: 768px) {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
`;

const Footer = styled.footer`
  padding: 60px 40px 30px;
  background: linear-gradient(135deg, #0a0a0a 0%, #151515 100%);
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ae76b6, #ffb3cc, #90cfff);
  }
`;

const FooterText = styled.p`
  font-size: 0.9rem;
  margin-bottom: 10px;
`;

const FloatingOrbs = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

const Orb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.2;
  background: linear-gradient(90deg, #ae76b6, #90cfff);
  animation: ${floatAnimation} ${props => props.duration || '15s'} infinite ease-in-out;
`;

const CodeContainer = styled.div`
  background:rgb(0, 0, 0);
  border-radius: 8px;
  padding: 20px;
  font-family: 'Fira Code', monospace;
  color: #f8f8f2;
  position: relative;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
`;

const CodeLine = styled.div`
  margin: 8px 0;
  white-space: nowrap;
  overflow: hidden;
  border-right: 2px solid #ae76b6;
  animation: 
    ${typewriter} ${props => props.speed || '3s'} steps(${props => props.steps || 30}) ${props => props.delay || '0s'} 1 normal both,
    ${blinkCaret} 0.75s step-end infinite;
`;

const Comment = styled.span`
  color: #6a9955;
  font-style: italic;
`;

const Keyword = styled.span`
  color: #569cd6;
`;

const FunctionName = styled.span`
  color: #dcdcaa;
`;

const Variable = styled.span`
  color: #9cdcfe;
`;

const String = styled.span`
  color: #ce9178;
`;

const Operator = styled.span`
  color: #d4d4d4;
`;

const TypewriterCode = () => {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines(prev => (prev < 6 ? prev + 1 : prev));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <CodeContainer>
      {visibleLines >= 1 && (
        <CodeLine speed="1.5s" steps={20} delay="0s">
          <Keyword>if</Keyword> (<Variable>a</Variable> <Operator> graeter </Operator> <Variable>b</Variable>) {'{'}
        </CodeLine>
      )}
      
      {visibleLines >= 2 && (
        <CodeLine speed="2s" steps={30} delay="1.5s">
          &nbsp;&nbsp;<FunctionName>printf</FunctionName>(<String>"a is greater than b\n"</String>);
        </CodeLine>
      )}
      
      {visibleLines >= 3 && (
        <CodeLine speed="1s" steps={10} delay="3.5s">
          {'}'} <Keyword>else</Keyword> <Keyword>if</Keyword> (<Variable>a</Variable> <Operator> less </Operator> <Variable>b</Variable>) {'{'}
        </CodeLine>
      )}
      
      {visibleLines >= 4 && (
        <CodeLine speed="2s" steps={30} delay="4.5s">
          &nbsp;&nbsp;<FunctionName>printf</FunctionName>(<String>"b is greater than a\n"</String>);
        </CodeLine>
      )}
      
      {visibleLines >= 5 && (
        <CodeLine speed="1s" steps={10} delay="6.5s">
          {'}'} <Keyword>else</Keyword> {'{'}
        </CodeLine>
      )}
      
      {visibleLines >= 6 && (
        <CodeLine speed="2s" steps={30} delay="7.5s">
          &nbsp;&nbsp;<FunctionName>printf</FunctionName>(<String>"a and b are equal\n"</String>);
        </CodeLine>
      )}
    </CodeContainer>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const overviewRef = useRef(null);
  const featuresRef = useRef(null);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const handleGetStarted = () => {
    navigate('/convert');
  };

  return (
    <Wrapper ref={containerRef}>
      <FloatingOrbs>
        <Orb style={{ 
          width: '400px', 
          height: '400px', 
          top: '10%', 
          left: '10%',
          animationDuration: '20s'
        }} />
        <Orb style={{ 
          width: '600px', 
          height: '600px', 
          top: '60%', 
          right: '-10%',
          animationDuration: '25s'
        }} />
        <Orb style={{ 
          width: '300px', 
          height: '300px', 
          bottom: '10%', 
          left: '20%',
          animationDuration: '18s'
        }} />
      </FloatingOrbs>

      <LayoutContainer>
        <div style={{ width: '100%', position: 'relative' }}>
          <Navbar scrollRefs={{ overviewRef, featuresRef }} />
          
          <Hero>
            <HeroContent>
              <HeroText>
                <Title>Automated 
                    <br/> C Code Generation</Title>
                <SubText>
                  Transform your logic into <Highlight>clean, efficient C code</Highlight> with our
                  platform. Save hours of manual coding.
                </SubText>
                <CtaButton 
                  onClick={handleGetStarted}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Generate Code Now
                </CtaButton>
              </HeroText>
              
              <CodePreview>
                <TypewriterCode />
              </CodePreview>
            </HeroContent>
          </Hero>

          <Section ref={overviewRef}>
            <SectionTitle
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Intelligent Code Conversion
            </SectionTitle>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Paragraph>
                Our platform <Highlight>automates the translation</Highlight> of logic into structured C code.
              </Paragraph>
            </motion.div>

            <FeatureGrid>
              <FeatureCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <FeatureIcon>📄</FeatureIcon>
                <FeatureTitle>Input Processing</FeatureTitle>
                <FeatureDescription>
                  Handles various input formats and converts them to logical structures.
                </FeatureDescription>
              </FeatureCard>

              <FeatureCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <FeatureIcon>🤖</FeatureIcon>
                <FeatureTitle>Smart Conversion</FeatureTitle>
                <FeatureDescription>
                  Transforms logical conditions into optimized C code structures.
                </FeatureDescription>
              </FeatureCard>

              <FeatureCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <FeatureIcon>⚡</FeatureIcon>
                <FeatureTitle>Efficient Output</FeatureTitle>
                <FeatureDescription>
                  Generates clean, well-commented C code following best practices.
                </FeatureDescription>
              </FeatureCard>
            </FeatureGrid>
          </Section>

          <Section ref={featuresRef} style={{ backgroundColor: 'rgba(15, 15, 15, 0.7)' }}>
            <SectionTitle
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              How It Works
            </SectionTitle>
            
            <FeatureGrid>
              <motion.div style={{ y: y1 }}>
                <FeatureCard>
                  <FeatureIcon>1</FeatureIcon>
                  <FeatureTitle>Provide Input</FeatureTitle>
                  <FeatureDescription>
                    Enter your logic or upload a file with your conditions.
                  </FeatureDescription>
                </FeatureCard>
              </motion.div>

              <motion.div style={{ y: y2 }}>
                <FeatureCard>
                  <FeatureIcon>2</FeatureIcon>
                  <FeatureTitle>Automated Analysis</FeatureTitle>
                  <FeatureDescription>
                    Our system processes the input and builds the logic tree.
                  </FeatureDescription>
                </FeatureCard>
              </motion.div>

              <motion.div style={{ y: y3 }}>
                <FeatureCard>
                  <FeatureIcon>3</FeatureIcon>
                  <FeatureTitle>Get C Code</FeatureTitle>
                  <FeatureDescription>
                    Download clean, modular C code ready for integration.
                  </FeatureDescription>
                </FeatureCard>
              </motion.div>
            </FeatureGrid>
          </Section>

          <CtaSection>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <CtaTitle>Ready to Transform Your Workflow?</CtaTitle>
              <Paragraph style={{ maxWidth: '700px', margin: '0 auto 40px' }}>
                Join developers who save hours every week by automating their C code generation.
              </Paragraph>
              <CtaButton 
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Generating Code Now
              </CtaButton>
            </motion.div>
          </CtaSection>

          <Footer>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <FooterText>© {new Date().getFullYear()} C Code Generator. All rights reserved.</FooterText>
            </motion.div>
          </Footer>
        </div>
      </LayoutContainer>
    </Wrapper>
  );
};

export default Home;