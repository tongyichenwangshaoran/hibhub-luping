"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeType = 'color' | 'blackAndWhite';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('blackAndWhite');

  // 切换主题
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'color' ? 'blackAndWhite' : 'color');
  };

  // 当主题变化时，更新文档根元素的类名
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'blackAndWhite') {
      root.classList.add('theme-bw');
    } else {
      root.classList.remove('theme-bw');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
