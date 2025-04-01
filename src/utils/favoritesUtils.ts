
import { WineInfo } from '@/components/wine/WineCard';

/**
 * Utility for managing favorite wines
 */

// Favorites storage key
const FAVORITES_STORAGE_KEY = 'winecheck-favorites';

/**
 * Add a wine to favorites
 */
export const addFavorite = (wine: WineInfo): void => {
  const favorites = getFavorites();
  
  // Check if already in favorites
  if (!favorites.some(fav => fav.id === wine.id)) {
    favorites.push(wine);
    saveFavorites(favorites);
  }
};

/**
 * Remove a wine from favorites
 */
export const removeFavorite = (wineId: string): void => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(wine => wine.id !== wineId);
  saveFavorites(updatedFavorites);
};

/**
 * Check if a wine is in favorites
 */
export const isFavorite = (wineId: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(wine => wine.id === wineId);
};

/**
 * Toggle a wine's favorite status
 */
export const toggleFavorite = (wine: WineInfo): boolean => {
  const isFav = isFavorite(wine.id);
  
  if (isFav) {
    removeFavorite(wine.id);
    return false;
  } else {
    addFavorite(wine);
    return true;
  }
};

/**
 * Get all favorite wines
 */
export const getFavorites = (): WineInfo[] => {
  try {
    const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

/**
 * Save favorites to localStorage
 */
const saveFavorites = (favorites: WineInfo[]): void => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

/**
 * Clear all favorites
 */
export const clearFavorites = (): void => {
  localStorage.removeItem(FAVORITES_STORAGE_KEY);
};
