
import { WineInfo } from '@/components/wine/WineCard';

// In-memory cache for wines
const wineCache: Record<string, WineInfo> = {};

/**
 * Get detailed information about a specific wine
 * In a real app, this would fetch from an API
 */
export const getWineDetails = async (id: string): Promise<WineInfo> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Check if wine exists in cache
  if (wineCache[id]) {
    return wineCache[id];
  }
  
  // In a real app, this would be a server API call
  // For demo purposes, we'll throw an error for invalid IDs
  if (!id.startsWith('wine-')) {
    throw new Error('Wine not found');
  }
  
  // Generate generic wine data if not in cache
  // In production, this would be fetched from a database
  const wineData: WineInfo = {
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
  wineCache[id] = wineData;
  
  return wineData;
};

/**
 * Store wine results in memory for retrieval
 * In a real app, this would likely use localStorage or a database
 */
export const storeWineResults = (wines: WineInfo[]): void => {
  wines.forEach(wine => {
    wineCache[wine.id] = wine;
  });
};

/**
 * Get all stored wines
 * In a real app, this would likely fetch from localStorage or a database
 */
export const getAllStoredWines = (): WineInfo[] => {
  return Object.values(wineCache);
};
