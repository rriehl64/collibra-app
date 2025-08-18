import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material';
import { deepmerge } from '@mui/utils';

// USCIS color standards
const USCIS_BLUE = '#003366';
const USCIS_RED = '#B31B1B';

// Theme preferences type
type ThemePreferences = {
  mode: 'light' | 'dark' | 'system';
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  primaryColor: string;
};

// Context value type
type ThemeContextType = {
  themePreferences: ThemePreferences;
  theme: Theme;
  updateThemePreferences: (preferences: Partial<ThemePreferences>) => void;
};

// Default preferences
const defaultPreferences: ThemePreferences = {
  mode: 'light',
  highContrast: false,
  fontSize: 'medium',
  primaryColor: USCIS_BLUE,
};

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  themePreferences: defaultPreferences,
  theme: createTheme(),
  updateThemePreferences: () => {},
});

// Hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get stored preferences or use defaults
  const storedPreferencesString = localStorage.getItem('themePreferences');
  const storedPreferences = storedPreferencesString 
    ? JSON.parse(storedPreferencesString) 
    : {};

  // Initialize state with stored or default preferences
  const [themePreferences, setThemePreferences] = useState<ThemePreferences>({
    ...defaultPreferences,
    ...storedPreferences
  });

  // Effect to detect system preference changes
  useEffect(() => {
    if (themePreferences.mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => setThemePreferences(prev => ({ ...prev }));
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themePreferences.mode]);
  
  // Update theme preferences
  const updateThemePreferences = (preferences: Partial<ThemePreferences>) => {
    setThemePreferences(prev => {
      const newPreferences = { ...prev, ...preferences };
      localStorage.setItem('themePreferences', JSON.stringify(newPreferences));
      
      // Force a re-render of components using this theme
      document.body.style.fontSize = newPreferences.fontSize === 'small' ? '14px' : 
                                   newPreferences.fontSize === 'large' ? '18px' : '16px';
      
      return newPreferences;
    });
  };

  // Determine actual mode based on preferences
  const determineActualMode = (): 'light' | 'dark' => {
    if (themePreferences.mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themePreferences.mode;
  };

  // Create the appropriate theme based on preferences
  const actualMode = determineActualMode();
  
  // Base theme with common settings
  const baseTheme = {
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      fontSize: themePreferences.fontSize === 'small' ? 14 : 
                themePreferences.fontSize === 'large' ? 18 : 16,
      h1: {
        fontWeight: 600,
        fontSize: themePreferences.fontSize === 'small' ? '2.2rem' : 
                 themePreferences.fontSize === 'large' ? '3rem' : '2.5rem',
      },
      h2: {
        fontWeight: 600,
        fontSize: themePreferences.fontSize === 'small' ? '1.8rem' : 
                 themePreferences.fontSize === 'large' ? '2.4rem' : '2rem',
      },
      button: {
        textTransform: 'none' as const,
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            padding: '8px 16px',
          }
        }
      },
      // Focus visible styling handled by default MUI implementation
    },
  };

  // Light mode theme
  const lightTheme = deepmerge(baseTheme, {
    palette: {
      mode: 'light',
      primary: {
        main: themePreferences.primaryColor,
        dark: themePreferences.primaryColor === USCIS_BLUE ? '#002244' : undefined,
      },
      secondary: {
        main: USCIS_RED,
        dark: '#8A1515',
      },
      background: {
        default: themePreferences.highContrast ? '#FFFFFF' : '#F5F6F7',
        paper: '#FFFFFF',
      },
      text: {
        primary: themePreferences.highContrast ? '#000000' : '#0C1F3F',
        secondary: themePreferences.highContrast ? '#000000' : '#2D3436',
      },
      error: {
        main: USCIS_RED,
      },
    },
  });

  // Dark mode theme
  const darkTheme = deepmerge(baseTheme, {
    palette: {
      mode: 'dark',
      primary: {
        main: themePreferences.primaryColor === USCIS_BLUE ? '#3366BB' : themePreferences.primaryColor,
      },
      secondary: {
        main: USCIS_RED === '#B31B1B' ? '#FF4444' : USCIS_RED,
      },
      background: {
        default: themePreferences.highContrast ? '#000000' : '#121212',
        paper: themePreferences.highContrast ? '#000000' : '#1E1E1E',
      },
      text: {
        primary: themePreferences.highContrast ? '#FFFFFF' : '#E0E0E0',
        secondary: themePreferences.highContrast ? '#FFFFFF' : '#B0B0B0',
      },
      error: {
        main: '#FF6B6B',
      },
    },
  });

  // Create the final theme
  const theme = createTheme(actualMode === 'light' ? lightTheme : darkTheme);

  // Apply global CSS variables for consistent font sizing across the application
  React.useEffect(() => {
    // Set CSS variables on the root element for font sizes
    document.documentElement.style.setProperty(
      '--app-font-size-base', 
      themePreferences.fontSize === 'small' ? '14px' : 
      themePreferences.fontSize === 'large' ? '18px' : '16px'
    );
    
    document.documentElement.style.setProperty(
      '--app-font-scale-factor', 
      themePreferences.fontSize === 'small' ? '0.875' : 
      themePreferences.fontSize === 'large' ? '1.125' : '1'
    );
    
    // Apply a class to the body for potential CSS targeting
    document.body.className = `theme-${actualMode} font-${themePreferences.fontSize}${
      themePreferences.highContrast ? ' high-contrast' : ''
    }`;
  }, [themePreferences.fontSize, themePreferences.highContrast, actualMode]);
  
  // Return provider with theme
  return (
    <ThemeContext.Provider value={{ themePreferences, theme, updateThemePreferences }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
