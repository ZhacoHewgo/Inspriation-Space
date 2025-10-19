import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    card: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const createColors = (isDark: boolean, primaryColor: string) => {
  if (isDark) {
    return {
      background: '#101c22',
      surface: '#1e293b',
      text: '#ffffff',
      textSecondary: '#94a3b8',
      border: '#334155',
      primary: primaryColor,
      card: '#1e293b',
    };
  } else {
    return {
      background: '#f6f7f8',
      surface: '#ffffff',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      primary: primaryColor,
      card: '#ffffff',
    };
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#13a4ec');

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const colors = createColors(isDarkMode, primaryColor);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        primaryColor,
        setPrimaryColor,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}