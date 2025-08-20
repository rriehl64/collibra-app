/**
 * Accessibility Context
 * 
 * Provides global accessibility settings and preferences
 * following Section 508 compliance requirements.
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our accessibility settings
export interface AccessibilitySettings {
  // Visual preferences
  fontSize: 'normal' | 'large' | 'x-large';
  highContrast: boolean;
  reducedMotion: boolean;
  
  // Interaction preferences
  enhancedFocus: boolean;
  keyboardMode: boolean;
  
  // Screen reader optimizations
  verboseLabels: boolean;
  
  // Additional settings
  textSpacing: boolean;
}

// Define the context shape with settings and updater functions
interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    setting: K, 
    value: AccessibilitySettings[K]
  ) => void;
  resetSettings: () => void;
}

// Default settings following USCIS guidelines
export const defaultSettings: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  enhancedFocus: false,
  keyboardMode: false,
  verboseLabels: false,
  textSpacing: false,
};

// Create the context with a default value
const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: defaultSettings,
  updateSetting: () => {},
  resetSettings: () => {},
});

// Provider component that wraps the app
interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  // Initialize state from localStorage or default values
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Update a single setting
  const updateSetting = <K extends keyof AccessibilitySettings>(
    setting: K, 
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);
    localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings));
  };

  // Reset all settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem('accessibilitySettings', JSON.stringify(defaultSettings));
  };

  // Apply body classes for global styles based on settings
  useEffect(() => {
    // High contrast mode
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Font size
    document.body.classList.remove('font-large', 'font-x-large');
    if (settings.fontSize === 'large') {
      document.body.classList.add('font-large');
    } else if (settings.fontSize === 'x-large') {
      document.body.classList.add('font-x-large');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }

    // Enhanced focus outlines
    if (settings.enhancedFocus) {
      document.body.classList.add('enhanced-focus');
    } else {
      document.body.classList.remove('enhanced-focus');
    }

    // Text spacing
    if (settings.textSpacing) {
      document.body.classList.add('text-spacing');
    } else {
      document.body.classList.remove('text-spacing');
    }
  }, [settings]);

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook for using the accessibility context
export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
