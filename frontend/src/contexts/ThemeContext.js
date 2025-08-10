import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('skillsync-theme');
    return saved || 'light';
  });

  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('skillsync-fontSize');
    return saved || 'medium';
  });

  const [compactMode, setCompactMode] = useState(() => {
    const saved = localStorage.getItem('skillsync-compactMode');
    return saved === 'true';
  });

  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('skillsync-language');
    return saved || 'en';
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-auto');
    
    if (theme === 'auto') {
      // Use system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const applySystemTheme = () => {
        root.classList.add(mediaQuery.matches ? 'theme-dark' : 'theme-light');
      };
      
      applySystemTheme();
      mediaQuery.addEventListener('change', applySystemTheme);
      
      return () => mediaQuery.removeEventListener('change', applySystemTheme);
    } else {
      root.classList.add(`theme-${theme}`);
    }
    
    localStorage.setItem('skillsync-theme', theme);
  }, [theme]);

  // Apply font size
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    root.classList.add(`font-${fontSize}`);
    localStorage.setItem('skillsync-fontSize', fontSize);
  }, [fontSize]);

  // Apply compact mode
  useEffect(() => {
    const root = document.documentElement;
    if (compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
    localStorage.setItem('skillsync-compactMode', compactMode.toString());
  }, [compactMode]);

  // Apply language
  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('skillsync-language', language);
  }, [language]);

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const updateFontSize = (newFontSize) => {
    setFontSize(newFontSize);
  };

  const updateCompactMode = (newCompactMode) => {
    setCompactMode(newCompactMode);
  };

  const updateLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const isDarkMode = () => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    if (theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };

  const value = {
    theme,
    fontSize,
    compactMode,
    language,
    updateTheme,
    updateFontSize,
    updateCompactMode,
    updateLanguage,
    isDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 