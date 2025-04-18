
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppSettings {
  discreetMode: boolean;
  showRatings: boolean;
  showPrices: boolean;
  showSavings: boolean;
  demoMode: boolean; // Added demo mode setting
}

interface AppSettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  discreetMode: false,
  showRatings: true,
  showPrices: true,
  showSavings: true,
  demoMode: true, // Enable demo mode by default
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        return {
          ...defaultSettings,
          ...parsedSettings,
          // Always enable demo mode if the app is run in a demo context or iframe
          // Fix the operator precedence with parentheses
          demoMode: (parsedSettings.demoMode ?? true) || window.location.href.includes('demo') || window !== window.parent
        };
      } catch (e) {
        console.error('Error parsing saved settings:', e);
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Update settings and save to localStorage
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('appSettings', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AppSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};
