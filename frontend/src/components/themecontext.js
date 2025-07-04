import React, { createContext, useContext, useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';

// Create context
const ThemeContext = createContext();

// Global style component for theme transitions
const GlobalStyle = createGlobalStyle`
  * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }
`;

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Initialize state with user's preferred color scheme (or default to dark)
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    // Check localStorage for saved preference
    const savedTheme = localStorage.getItem('themePreference');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Fallback to system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('themePreference', isDarkTheme ? 'dark' : 'light');
    
    // Update document class for tailwind or other CSS frameworks
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkTheme]);

  // Theme object with colors for both themes
  const theme = {
    isDarkTheme,
    toggleTheme,
    colors: {
      background: isDarkTheme ? '#1a1a1a' : '#f5f7fa',
      text: isDarkTheme ? '#ffffff' : '#333333',
      primary: isDarkTheme ? '#ae76b6' : '#8a5a91',
      secondary: isDarkTheme ? '#90cfff' : '#0066cc',
      cardBg: isDarkTheme ? 'rgba(46, 46, 46, 0.5)' : 'rgba(240, 240, 240, 0.8)',
      border: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      <GlobalStyle />
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};