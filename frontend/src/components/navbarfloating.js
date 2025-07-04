import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FloatingNav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <NavContainer
      as={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      scrolled={scrolled}
    >
      <NavItem>Work</NavItem>
      <NavItem>About</NavItem>
      <NavItem>Services</NavItem>
      <NavItem>Community</NavItem>
      <NavItem>Contact</NavItem>
      <Arrow>↑</Arrow>
    </NavContainer>
  );
};

export default FloatingNav;

// ========== Styled Components ==========

const NavContainer = styled.div`
  position: fixed;
  top: ${({ scrolled }) => (scrolled ? '20px' : '40px')};
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  padding: 10px 28px;
  border-radius: 999px;
  display: flex;
  gap: 16px;
  z-index: 9999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease-in-out;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.div`
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 500;
  color: #111;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const Arrow = styled.div`
  padding-left: 8px;
  font-size: 20px;
  color: #222;
`;
