import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  const storedTheme = localStorage.getItem('mindsprouts-theme') as Theme | null;
  if (storedTheme && ['light', 'dark'].includes(storedTheme)) {
    return storedTheme;
  }
  // Default to light theme if no preference is stored, ignoring system settings.
  return 'light';
};

// This logic now runs when the module is first loaded, *before* React renders.
// This prevents the flash of an incorrect theme.
const initialTheme = getInitialTheme();
if (typeof window !== 'undefined') {
  const root = document.documentElement;
  // It's safe to remove both, as only one or none will be present.
  root.classList.remove('light', 'dark');
  root.classList.add(initialTheme);
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with the pre-calculated value.
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
      localStorage.setItem('mindsprouts-theme', newTheme);
      return newTheme;
    });
  }, []);

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
