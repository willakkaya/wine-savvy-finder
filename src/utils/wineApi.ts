
import { config } from '@/lib/config';
import { WineInfo } from '@/components/wine/WineCard';

/**
 * Wine API configuration
 * In a production app, API keys would be stored in environment variables or Supabase secrets
 */
const API_CONFIG = {
  // Global Wine Score API
  globalWineScore: {
    baseUrl: 'https://api.globalwinescore.com/globalwinescores/latest/',
    // This is a sample API key - in production, use a real API key
    apiKey: 'DEMO_API_KEY', 
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Token DEMO_API_KEY'
    }
  },
  // CellarTracker API
  cellarTracker: {
    baseUrl: 'https://api.cellartracker.com/api/wines',
    apiKey: 'YOUR_CELLARTRACKER_API_KEY', // Replace with your actual CellarTracker API key
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
};

/**
 * Interface for the wine data returned from Global Wine Score API
 */
export interface WineApiResponse {
  wine: string;
  wine_id: number;
  wine_slug: string;
  appellation: string;
  appellation_slug: string;
  color: string;
  wine_type: string;
  regions: string[];
  country: string;
  classification: string;
  vintage: string;
  date: string;
  score: number;
  confidence_index: string;
  journalist_count: number;
  lwin: number | null;
  lwin_11: number | null;
}

/**
 * Interface for CellarTracker API response
 */
export interface CellarTrackerWine {
  id: number;
  name: string;
  producer: string;
  vintage: number;
  region: string;
  country: string;
  type: string;
  varietal: string;
  price?: number;
  marketPrice?: number;
  communityRating?: number;
  professionalRating?: number;
  imageUrl?: string;
}

/**
 * Search for wines in the external API
 */
export const searchWines = async (query: string): Promise<WineInfo[]> => {
  // In development or if API is disabled, return mock data
  if (!config.features.enableRealWineApi) {
    console.log('Using mock data - real API is disabled');
    return getMockWineData(query);
  }

  try {
    if (config.features.useCellarTrackerApi) {
      return searchCellarTracker(query);
    } else {
      return searchGlobalWineScore(query);
    }
  } catch (error) {
    console.error('Error fetching wine data:', error);
    // Fallback to mock data on error
    return getMockWineData(query);
  }
};

/**
 * Search wines using the CellarTracker API
 */
const searchCellarTracker = async (query: string): Promise<WineInfo[]> => {
  try {
    // Build the query parameters
    const params = new URLSearchParams({
      search: query,
      apikey: API_CONFIG.cellarTracker.apiKey
    });
    
    const url = `${API_CONFIG.cellarTracker.baseUrl}?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: API_CONFIG.cellarTracker.headers,
    });

    if (!response.ok) {
      throw new Error(`CellarTracker API error: ${response.status}`);
    }

    const data = await response.json();
    return convertCellarTrackerToWineInfo(data.wines || []);
  } catch (error) {
    console.error('Error searching CellarTracker:', error);
    throw error;
  }
};

/**
 * Search wines using the Global Wine Score API
 */
const searchGlobalWineScore = async (query: string): Promise<WineInfo[]> => {
  try {
    const url = new URL(`${API_CONFIG.globalWineScore.baseUrl}?wine=${encodeURIComponent(query)}`);
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: API_CONFIG.globalWineScore.headers,
    });

    if (!response.ok) {
      throw new Error(`Global Wine Score API error: ${response.status}`);
    }

    const data = await response.json();
    return convertApiResponseToWineInfo(data.results || []);
  } catch (error) {
    console.error('Error searching Global Wine Score:', error);
    throw error;
  }
};

/**
 * Get details for a specific wine by ID
 */
export const getWineById = async (id: string): Promise<WineInfo | null> => {
  // In development or if API is disabled, return mock data
  if (!config.features.enableRealWineApi) {
    console.log('Using mock data - real API is disabled');
    // Use the id as a seed for consistent mock data
    const mockWines = getMockWineData(id);
    return mockWines.length > 0 ? mockWines[0] : null;
  }

  try {
    if (config.features.useCellarTrackerApi) {
      return getWineFromCellarTracker(id);
    } else {
      return getWineFromGlobalWineScore(id);
    }
  } catch (error) {
    console.error('Error fetching wine details:', error);
    // Fallback to mock data on error
    const mockWines = getMockWineData(id);
    return mockWines.length > 0 ? mockWines[0] : null;
  }
};

/**
 * Get wine details from CellarTracker API
 */
const getWineFromCellarTracker = async (id: string): Promise<WineInfo | null> => {
  try {
    // Extract numeric ID if using our internal format (wine-12345)
    const numericId = id.startsWith('wine-') ? id.replace('wine-', '') : id;
    
    const url = `${API_CONFIG.cellarTracker.baseUrl}/${numericId}?apikey=${API_CONFIG.cellarTracker.apiKey}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: API_CONFIG.cellarTracker.headers,
    });

    if (!response.ok) {
      throw new Error(`CellarTracker API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.wine) {
      return null;
    }
    
    const wineList = convertCellarTrackerToWineInfo([data.wine]);
    return wineList.length > 0 ? wineList[0] : null;
  } catch (error) {
    console.error('Error fetching wine from CellarTracker:', error);
    throw error;
  }
};

/**
 * Get wine details from Global Wine Score API
 */
const getWineFromGlobalWineScore = async (id: string): Promise<WineInfo | null> => {
  try {
    // Extract numeric ID if using our internal format (wine-12345)
    const numericId = id.startsWith('wine-') ? id.replace('wine-', '') : id;
    
    const url = new URL(`${API_CONFIG.globalWineScore.baseUrl}${numericId}/`);
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: API_CONFIG.globalWineScore.headers,
    });

    if (!response.ok) {
      throw new Error(`Global Wine Score API error: ${response.status}`);
    }

    const data = await response.json();
    const wines = convertApiResponseToWineInfo([data]);
    return wines.length > 0 ? wines[0] : null;
  } catch (error) {
    console.error('Error fetching wine from Global Wine Score:', error);
    throw error;
  }
};

/**
 * Convert CellarTracker API response to our WineInfo format
 */
const convertCellarTrackerToWineInfo = (ctWines: CellarTrackerWine[]): WineInfo[] => {
  return ctWines.map((ctWine, index) => {
    // Use provided market price or generate one based on the community rating
    const price = ctWine.price || Math.round(20 + (ctWine.communityRating || 85) * 0.8);
    const marketPrice = ctWine.marketPrice || Math.round(price * (1.2 + Math.random() * 0.3));
    
    // Calculate value score
    const priceDifferencePercent = (marketPrice - price) / marketPrice;
    const communityRating = ctWine.communityRating || 85;
    const valueScore = Math.round(
      (priceDifferencePercent * 50) + 
      ((communityRating - 80) / 20 * 50)
    );
    
    return {
      id: `wine-${ctWine.id || Date.now() + index}`,
      name: ctWine.name,
      winery: ctWine.producer,
      year: ctWine.vintage,
      region: ctWine.region,
      country: ctWine.country,
      price: price,
      marketPrice: marketPrice,
      rating: ctWine.professionalRating || ctWine.communityRating || 87,
      valueScore: valueScore,
      imageUrl: ctWine.imageUrl || getWineImageByType(ctWine.type),
    };
  });
};

/**
 * Get image URL based on wine type for CellarTracker wines
 */
const getWineImageByType = (type: string): string => {
  const typeNormalized = (type || '').toLowerCase();
  
  if (typeNormalized.includes('red')) {
    return 'https://images.vivino.com/thumbs/4RHhCzeQTsCeyCScxO0LOw_pb_600x600.png';
  } else if (typeNormalized.includes('white')) {
    return 'https://images.vivino.com/thumbs/IEmxs47ITIaHXPJkvE9j7Q_pb_600x600.png';
  } else if (typeNormalized.includes('rose') || typeNormalized.includes('rosé')) {
    return 'https://images.vivino.com/thumbs/ElcyI1YpRSes_LvNodMeSQ_pb_600x600.png';
  } else if (typeNormalized.includes('sparkl') || typeNormalized.includes('champagne')) {
    return 'https://images.vivino.com/thumbs/O-f9VelHQTiR-KJVYIXJcw_pb_600x600.png';
  }
  
  // Default wine image
  return 'https://images.vivino.com/thumbs/FGfB1q0wSs-ySFhMN5uE1Q_pb_600x600.png';
};

/**
 * Convert Global Wine Score API response to our WineInfo format
 */
const convertApiResponseToWineInfo = (apiWines: WineApiResponse[]): WineInfo[] => {
  return apiWines.map((apiWine, index) => {
    // Generate a price based on the score (higher scores = higher prices)
    // This is a simulation as the API doesn't provide pricing data
    const basePrice = 20 + Math.round((apiWine.score - 80) * 5);
    const price = basePrice + Math.round(Math.random() * 20);
    
    // Generate a market price that's typically higher than the restaurant price
    const marketPriceVariance = Math.random();
    let marketPrice;
    if (marketPriceVariance > 0.8) {
      marketPrice = price * (1.5 + Math.random() * 0.5);
    } else if (marketPriceVariance > 0.5) {
      marketPrice = price * (1.1 + Math.random() * 0.3);
    } else {
      marketPrice = price * (0.9 + Math.random() * 0.1);
    }
    marketPrice = Math.round(marketPrice);
    
    // Calculate value score
    const priceDifferencePercent = (marketPrice - price) / marketPrice;
    const valueScore = Math.round(
      (priceDifferencePercent * 50) + 
      ((apiWine.score - 80) / 20 * 50)
    );
    
    // Format the wine name and winery
    const nameParts = apiWine.wine.split(' ');
    const winery = nameParts.length > 1 ? nameParts[0] : 'Unknown';
    
    return {
      id: `wine-${apiWine.wine_id || Date.now() + index}`,
      name: apiWine.wine,
      winery: winery,
      year: parseInt(apiWine.vintage) || new Date().getFullYear() - 5,
      region: apiWine.appellation || apiWine.regions?.[0] || 'Unknown Region',
      country: apiWine.country || 'Unknown Country',
      price: price,
      marketPrice: marketPrice,
      rating: apiWine.score,
      valueScore: valueScore,
      imageUrl: getWineImageUrl(apiWine),
    };
  });
};

/**
 * Get image URL for a wine
 */
const getWineImageUrl = (wine: WineApiResponse): string => {
  // In a real app, you would use a wine image database or an image API
  // For now, use sample images based on wine color/type
  const colorLower = (wine.color || '').toLowerCase();
  
  if (colorLower.includes('red')) {
    return 'https://images.vivino.com/thumbs/4RHhCzeQTsCeyCScxO0LOw_pb_600x600.png';
  } else if (colorLower.includes('white')) {
    return 'https://images.vivino.com/thumbs/IEmxs47ITIaHXPJkvE9j7Q_pb_600x600.png';
  } else if (colorLower.includes('rose') || colorLower.includes('rosé')) {
    return 'https://images.vivino.com/thumbs/ElcyI1YpRSes_LvNodMeSQ_pb_600x600.png';
  } else if (wine.wine_type && wine.wine_type.toLowerCase().includes('sparkl')) {
    return 'https://images.vivino.com/thumbs/O-f9VelHQTiR-KJVYIXJcw_pb_600x600.png';
  }
  
  // Default wine image
  return 'https://images.vivino.com/thumbs/FGfB1q0wSs-ySFhMN5uE1Q_pb_600x600.png';
};

/**
 * Get mock wine data as a fallback
 */
const getMockWineData = (query: string): WineInfo[] => {
  // Generate a consistent set of mock wines based on the query
  const seed = query.length;
  const wineCount = 2 + (seed % 4); // 2-5 wines
  
  const wineries = [
    'Château Margaux', 'Domaine Leroy', 'Opus One', 'Screaming Eagle', 
    'Penfolds', 'Sassicaia', 'Silver Oak', 'Dom Pérignon', 'Caymus'
  ];
  
  const varietals = [
    'Cabernet Sauvignon', 'Pinot Noir', 'Chardonnay', 'Merlot', 
    'Syrah', 'Sauvignon Blanc', 'Riesling', 'Malbec', 'Zinfandel'
  ];
  
  const regions = [
    'Bordeaux', 'Burgundy', 'Napa Valley', 'Tuscany', 'Barossa Valley',
    'Piedmont', 'Rioja', 'Champagne', 'Sonoma'
  ];
  
  const countries = [
    'France', 'Italy', 'USA', 'Australia', 'Spain'
  ];
  
  const result: WineInfo[] = [];
  
  for (let i = 0; i < wineCount; i++) {
    const wineryIndex = (seed + i) % wineries.length;
    const varietalIndex = (seed + i * 2) % varietals.length;
    const regionIndex = (seed + i * 3) % regions.length;
    const countryIndex = (seed + i * 2) % countries.length;
    
    const winery = wineries[wineryIndex];
    const varietal = varietals[varietalIndex];
    const year = 2015 + ((seed + i) % 8);
    
    // Base rating on query length for consistency
    const rating = 85 + ((seed + i) % 15);
    
    // Price based on rating
    const price = 35 + (rating - 85) * 6 + ((seed + i) % 30);
    const marketPrice = price * (1.2 + (i * 0.1));
    
    // Calculate value score
    const priceDifferencePercent = (marketPrice - price) / marketPrice;
    const valueScore = Math.round(
      (priceDifferencePercent * 50) + 
      ((rating - 85) / 15 * 50)
    );
    
    result.push({
      id: `wine-${Date.now()}-${i}`,
      name: `${winery} ${varietal}`,
      winery: winery,
      year: year,
      region: regions[regionIndex],
      country: countries[countryIndex],
      price: price,
      marketPrice: Math.round(marketPrice),
      rating: rating,
      valueScore: valueScore,
      imageUrl: `https://images.vivino.com/thumbs/${['4RHhCzeQTsCeyCScxO0LOw', 'FGfB1q0wSs-ySFhMN5uE1Q', 'ElcyI1YpRSes_LvNodMeSQ'][i % 3]}_pb_600x600.png`
    });
  }
  
  return result.sort((a, b) => b.valueScore - a.valueScore);
};
