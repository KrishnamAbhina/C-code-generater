import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #000000;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #ae76b6, #ffb3cc);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;

  @media (max-width: 768px) {
    gap: 15px;
  }
`;

const NavLink = styled(motion.div)`
  position: relative;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 6px;

  &:hover {
    color: white;
    background: rgba(174, 118, 182, 0.1);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 12px;
    width: calc(100% - 24px);
    height: 2px;
    background: linear-gradient(90deg, #ae76b6, #ffb3cc);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <NavContainer>
      <Logo 
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
      >
        C-GEN
      </Logo>
      
      <NavLinks>
        <NavLink 
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
        >
          Home
        </NavLink>
        <NavLink 
          onClick={() => navigate('/convert')}
          whileHover={{ scale: 1.05 }}
        >
          Converter
        </NavLink>
        <NavLink 
          onClick={() => navigate('/faq')}
          whileHover={{ scale: 1.05 }}
        >
          FAQ
        </NavLink>
      </NavLinks>
    </NavContainer>
  );
};

export default Navbar;