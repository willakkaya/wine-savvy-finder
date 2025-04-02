
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for wine preferences
export interface WinePreferences {
  favoriteVarietals: string[];
  preferredRegions: string[];
  tasteProfile: {
    sweetness: number; // 1-5 scale (dry to sweet)
    acidity: number;   // 1-5 scale (low to high)
    tannin: number;    // 1-5 scale (soft to firm)
    body: number;      // 1-5 scale (light to full)
  };
  priceRange: {
    min: number;
    max: number;
  };
  allergies: string[];
}

interface UserPreferencesContextType {
  preferences: WinePreferences;
  updatePreferences: (newPreferences: Partial<WinePreferences>) => void;
  resetPreferences: () => void;
  hasSetPreferences: boolean;
  setHasSetPreferences: (value: boolean) => void;
}

const defaultPreferences: WinePreferences = {
  favoriteVarietals: [],
  preferredRegions: [],
  tasteProfile: {
    sweetness: 3,
    acidity: 3,
    tannin: 3,
    body: 3,
  },
  priceRange: {
    min: 10,
    max: 50,
  },
  allergies: [],
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

const PREFERENCES_STORAGE_KEY = 'winecheck-preferences';
const PREFERENCES_SET_KEY = 'winecheck-preferences-set';

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<WinePreferences>(defaultPreferences);
  const [hasSetPreferences, setHasSetPreferences] = useState<boolean>(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const storedPreferences = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      const preferencesSet = localStorage.getItem(PREFERENCES_SET_KEY);
      
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
      
      if (preferencesSet) {
        setHasSetPreferences(JSON.parse(preferencesSet));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }, [preferences]);

  // Save preference set status to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(PREFERENCES_SET_KEY, JSON.stringify(hasSetPreferences));
    } catch (error) {
      console.error('Error saving preferences status:', error);
    }
  }, [hasSetPreferences]);

  const updatePreferences = (newPreferences: Partial<WinePreferences>) => {
    setPreferences(prev => {
      // Handle deep merge for taste profile and price range
      const merged = {
        ...prev,
        ...newPreferences,
        tasteProfile: {
          ...prev.tasteProfile,
          ...(newPreferences.tasteProfile || {}),
        },
        priceRange: {
          ...prev.priceRange,
          ...(newPreferences.priceRange || {}),
        },
      };
      return merged;
    });
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        resetPreferences,
        hasSetPreferences,
        setHasSetPreferences,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
