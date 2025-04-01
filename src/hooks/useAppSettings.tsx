
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppSettings {
  discreetMode: boolean;
  showRatings: boolean;
  showPrices: boolean;
  showSavings: boolean;
}

interface AppSettingsContextType {
  settings: AppSettings;
  toggleDiscreetMode: () => void;
  toggleShowRatings: () => void; 
  toggleShowPrices: () => void;
  toggleShowSavings: () => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  discreetMode: false,
  showRatings: true,
  showPrices: true,
  showSavings: true,
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'winecheck-settings';

export const AppSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [settings]);

  const toggleDiscreetMode = () => {
    setSettings(prev => ({
      ...prev,
      discreetMode: !prev.discreetMode,
    }));
  };

  const toggleShowRatings = () => {
    setSettings(prev => ({
      ...prev,
      showRatings: !prev.showRatings,
    }));
  };

  const toggleShowPrices = () => {
    setSettings(prev => ({
      ...prev,
      showPrices: !prev.showPrices,
    }));
  };

  const toggleShowSavings = () => {
    setSettings(prev => ({
      ...prev,
      showSavings: !prev.showSavings,
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AppSettingsContext.Provider
      value={{
        settings,
        toggleDiscreetMode,
        toggleShowRatings,
        toggleShowPrices,
        toggleShowSavings,
        resetSettings,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = (): AppSettingsContextType => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};
