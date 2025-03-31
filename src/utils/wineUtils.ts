
import { WineInfo } from '@/components/wine/WineCard';
import { getWineById, searchWines } from './wineApi';

// In-memory cache for wines
const wineCache: Record<string, WineInfo> = {};

/**
 * Get detailed information about a specific wine
 */
export const getWineDetails = async (id: string): Promise<WineInfo> => {
  // Check if wine exists in cache
  if (wineCache[id]) {
    return wineCache[id];
  }
  
  try {
    // Attempt to get wine from API
    const wineData = await getWineById(id);
    
    if (wineData) {
      // Cache the result
      wineCache[id] = wineData;
      return wineData;
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
    wineCache[id] = genericWine;
    
    return genericWine;
  } catch (error) {
    console.error('Error fetching wine details:', error);
    throw new Error('Wine not found');
  }
};

/**
 * Store wine results in memory for retrieval
 */
export const storeWineResults = (wines: WineInfo[]): void => {
  wines.forEach(wine => {
    wineCache[wine.id] = wine;
  });
};

/**
 * Get all stored wines
 */
export const getAllStoredWines = (): WineInfo[] => {
  return Object.values(wineCache);
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
