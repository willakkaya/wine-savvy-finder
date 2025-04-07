
import { WineInfo } from '@/components/wine/WineCard';

const OFFLINE_WINES_KEY = 'offlineScannedWines';
const OFFLINE_TIMESTAMP_KEY = 'offlineWinesTimestamp';

/**
 * Store wines in local storage for offline access
 */
export const storeWinesOffline = (wines: WineInfo[]): void => {
  try {
    // Store wines data
    localStorage.setItem(OFFLINE_WINES_KEY, JSON.stringify(wines));
    // Also store timestamp of when the data was cached
    localStorage.setItem(OFFLINE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Failed to store wines offline:', error);
  }
};

/**
 * Get stored offline wines from local storage
 */
export const getOfflineWines = (): { wines: WineInfo[], timestamp: number | null } => {
  try {
    const winesData = localStorage.getItem(OFFLINE_WINES_KEY);
    const timestamp = localStorage.getItem(OFFLINE_TIMESTAMP_KEY);
    
    if (winesData) {
      return {
        wines: JSON.parse(winesData),
        timestamp: timestamp ? parseInt(timestamp) : null
      };
    }
  } catch (error) {
    console.error('Failed to retrieve offline wines:', error);
  }
  
  return { wines: [], timestamp: null };
};

/**
 * Check if there are offline wines available
 */
export const hasOfflineWines = (): boolean => {
  try {
    return !!localStorage.getItem(OFFLINE_WINES_KEY);
  } catch (error) {
    return false;
  }
};

/**
 * Get a specific wine from offline storage by ID
 */
export const getOfflineWineById = (id: string): WineInfo | null => {
  try {
    const { wines } = getOfflineWines();
    return wines.find(wine => wine.id === id) || null;
  } catch (error) {
    console.error('Failed to get offline wine by ID:', error);
    return null;
  }
};
