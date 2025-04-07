import { WineInfo } from '@/components/wine/WineCard';
import { getWineById, searchWines } from './wineApi';
import { config } from '@/lib/config';
import { getOfflineWineById } from './offlineUtils';

// In-memory cache for wines with expiration
interface CachedWine {
  data: WineInfo;
  timestamp: number;
}

const wineCache: Record<string, CachedWine> = {};
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Get detailed information about a specific wine
 */
export const getWineDetails = async (id: string): Promise<WineInfo> => {
  const now = Date.now();
  
  // Check if wine exists in cache and is not expired
  if (
    config.performance.cacheResults && 
    wineCache[id] && 
    (now - wineCache[id].timestamp) < CACHE_EXPIRY
  ) {
    return wineCache[id].data;
  }
  
  try {
    // If we're offline, try to get from offline storage first
    if (!navigator.onLine) {
      const offlineWine = getOfflineWineById(id);
      if (offlineWine) {
        return offlineWine;
      }
      throw new Error('No network connection and wine not found in offline storage');
    }
    
    // Attempt to get wine from API
    const wineData = await getWineById(id);
    
    if (wineData) {
      // Cache the result with timestamp
      if (config.performance.cacheResults) {
        wineCache[id] = { 
          data: wineData, 
          timestamp: now 
        };
      }
      return wineData;
    }
    
    // If no wine found and ID doesn't look valid, try offline storage
    const offlineWine = getOfflineWineById(id);
    if (offlineWine) {
      return offlineWine;
    }
    
    // If no wine found and ID doesn't look valid, throw error
    if (!id.startsWith('wine-')) {
      throw new Error('Wine not found');
    }
    
    // Generate generic wine data if API call failed or returned no data
    const genericWine: WineInfo = {
      id,
      name: "Sample Wine",
      winery: "Demo Winery",
      year: 2018,
      region: "Sample Region",
      country: "Sample Country",
      price: 85,
      marketPrice: 120,
      rating: 90,
      valueScore: 75,
      imageUrl: "https://images.vivino.com/thumbs/4RHhCzeQTsCeyCScxO0LOw_pb_600x600.png",
    };
    
    // Cache the result
    if (config.performance.cacheResults) {
      wineCache[id] = {
        data: genericWine,
        timestamp: now
      };
    }
    
    return genericWine;
  } catch (error) {
    console.error('Error fetching wine details:', error);
    
    // Last try from offline storage in case of error
    const offlineWine = getOfflineWineById(id);
    if (offlineWine) {
      return offlineWine;
    }
    
    throw new Error('Wine not found');
  }
};

/**
 * Store wine results in memory for retrieval
 */
export const storeWineResults = (wines: WineInfo[]): void => {
  if (!config.performance.cacheResults) return;
  
  const now = Date.now();
  wines.forEach(wine => {
    wineCache[wine.id] = {
      data: wine,
      timestamp: now
    };
  });
};

/**
 * Get all stored wines
 */
export const getAllStoredWines = (): WineInfo[] => {
  const now = Date.now();
  return Object.values(wineCache)
    .filter(cached => (now - cached.timestamp) < CACHE_EXPIRY)
    .map(cached => cached.data);
};

/**
 * Search for wines by name, region, or winery
 */
export const searchWinesByQuery = async (query: string): Promise<WineInfo[]> => {
  try {
    const results = await searchWines(query);
    
    // Cache the results
    storeWineResults(results);
    
    return results;
  } catch (error) {
    console.error('Error searching wines:', error);
    return [];
  }
};

/**
 * Clear the wine cache
 */
export const clearWineCache = (): void => {
  Object.keys(wineCache).forEach(key => {
    delete wineCache[key];
  });
};

/**
 * Clear expired entries from the wine cache
 */
export const pruneExpiredCache = (): number => {
  const now = Date.now();
  let prunedCount = 0;
  
  Object.keys(wineCache).forEach(key => {
    if ((now - wineCache[key].timestamp) >= CACHE_EXPIRY) {
      delete wineCache[key];
      prunedCount++;
    }
  });
  
  return prunedCount;
};

// Periodically clean up expired cache entries (every 30 minutes)
if (typeof window !== 'undefined') {
  setInterval(pruneExpiredCache, 30 * 60 * 1000);
}
