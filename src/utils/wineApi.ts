import { WineInfo } from '@/components/wine/WineCard';
import { config } from '@/lib/config';

// More realistic wine image URLs by type - we'll keep these as fallbacks
const wineImagesByType = {
  red: [
    "https://images.vivino.com/thumbs/uXOXvx3LSHSEDtyKULBF6Q_pb_600x600.png", // Cabernet Sauvignon
    "https://images.vivino.com/thumbs/0667TG7tRnCvIrGLX2_8Jg_pb_600x600.png", // Merlot
    "https://images.vivino.com/thumbs/4RHhCzeQTsCeyCScxO0LOw_pb_600x600.png", // Pinot Noir
    "https://images.vivino.com/thumbs/DtTrvFLfSdWIridBSpzQWQ_pb_600x600.png", // Syrah/Shiraz
    "https://images.vivino.com/thumbs/g0LwjU5ySGCVGCcnLJkCqQ_pb_600x600.png"  // Malbec
  ],
  white: [
    "https://images.vivino.com/thumbs/SL38tG4lQoCELG-4DzTy0w_pb_600x600.png", // Chardonnay
    "https://images.vivino.com/thumbs/HvTvhmaGQ5-gIrKcbgQHsQ_pb_600x600.png", // Sauvignon Blanc
    "https://images.vivino.com/thumbs/4vr20EL8TSCN_CGz72Znow_pb_600x600.png", // Pinot Grigio
    "https://images.vivino.com/thumbs/t_VW4taPR3SSe88diodvZA_pb_600x600.png", // Riesling
    "https://images.vivino.com/thumbs/5-vYq96hQH-AycVLO0ry1Q_pb_600x600.png"  // Viognier
  ],
  sparkling: [
    "https://images.vivino.com/thumbs/pEVCVwqLQmOcUugEjfYqYg_pb_600x600.png", // Champagne
    "https://images.vivino.com/thumbs/U19RXtSdRFKvQjS9LiQrzA_pb_600x600.png", // Prosecco
    "https://images.vivino.com/thumbs/T7M9fksIQNqsIADkiJ1K2g_pb_600x600.png", // Cava
    "https://images.vivino.com/thumbs/XCnf7AjZQeqb2uch9Qzt_Q_pb_600x600.png", // Sparkling Rosé
    "https://images.vivino.com/thumbs/cMWINRTXSPKK465-0SzwJA_pb_600x600.png"  // Crémant
  ],
  rose: [
    "https://images.vivino.com/thumbs/eEsJ2PN8R5KOFywDS5-aOQ_pb_600x600.png", // Provence Rosé
    "https://images.vivino.com/thumbs/1XYwrRMVSmSe6pQOA9CM3g_pb_600x600.png", // Grenache Rosé
    "https://images.vivino.com/thumbs/XErqVQ0wSEmZc8QbMMzNpA_pb_600x600.png", // Pinot Noir Rosé
    "https://images.vivino.com/thumbs/TUvBu2q0SL-jELnpuAJD4g_pb_600x600.png", // Syrah Rosé
    "https://images.vivino.com/thumbs/UgPvYVA0T5yTwYw7QLGkCg_pb_600x600.png"  // Rosé Blend
  ],
  dessert: [
    "https://images.vivino.com/thumbs/k6nJZXUcRfS1PGe-ZbqS8Q_pb_600x600.png", // Sauternes
    "https://images.vivino.com/thumbs/rKRnfpEMS-OkP6vwx-q3DQ_pb_600x600.png", // Port
    "https://images.vivino.com/thumbs/kHEEgniCSBu3OVrOpiK0WA_pb_600x600.png", // Ice Wine
    "https://images.vivino.com/thumbs/J7xCoXriSAmNQCwgpFtQKg_pb_600x600.png", // Sherry
    "https://images.vivino.com/thumbs/eS-xMHAeQ-m2JPXkq98_Ew_pb_600x600.png"  // Madeira
  ]
};

// Helper function to categorize wine and get appropriate image
const categorizeWine = (wine: WineInfo): { wineType: 'red' | 'white' | 'sparkling' | 'rose' | 'dessert', imageUrl: string } => {
  const wineName = wine.name.toLowerCase();
  const winery = wine.winery.toLowerCase();
  
  // Determine wine type from name
  let wineType: 'red' | 'white' | 'sparkling' | 'rose' | 'dessert' = 'red'; // Default
  
  // Check for red wines
  if (wineName.includes('red') || 
      wineName.includes('cabernet') || 
      wineName.includes('merlot') || 
      wineName.includes('pinot noir') || 
      wineName.includes('syrah') || 
      wineName.includes('shiraz') ||
      wineName.includes('zinfandel') ||
      wineName.includes('malbec') || 
      wineName.includes('sangiovese') ||
      wineName.includes('bordeaux') ||
      wineName.includes('chianti') ||
      wineName.includes('rioja') ||
      wineName.includes('barolo') ||
      wineName.includes('tempranillo')) {
    wineType = 'red';
  }
  // Check for white wines
  else if (wineName.includes('white') || 
      wineName.includes('chardonnay') || 
      wineName.includes('sauvignon blanc') || 
      wineName.includes('pinot grigio') || 
      wineName.includes('pinot gris') ||
      wineName.includes('riesling') || 
      wineName.includes('moscato') ||
      wineName.includes('gewürztraminer') ||
      wineName.includes('viognier') ||
      wineName.includes('albariño') ||
      wineName.includes('semillon')) {
    wineType = 'white';
  }
  // Check for sparkling wines
  else if (wineName.includes('champagne') || 
      wineName.includes('sparkling') || 
      wineName.includes('prosecco') ||
      wineName.includes('cava') || 
      wineName.includes('brut') ||
      wineName.includes('spumante') ||
      wineName.includes('crémant') ||
      wineName.includes('asti') ||
      winery.includes('veuve') ||
      winery.includes('moët') ||
      winery.includes('dom pérignon')) {
    wineType = 'sparkling';
  }
  // Check for rosé wines
  else if (wineName.includes('rosé') || 
      wineName.includes('rose') || 
      wineName.includes('blush') ||
      wineName.includes('pink')) {
    wineType = 'rose';
  }
  // Check for dessert wines
  else if (wineName.includes('port') || 
      wineName.includes('dessert') || 
      wineName.includes('sweet') || 
      wineName.includes('fortified') || 
      wineName.includes('sauternes') ||
      wineName.includes('ice wine') ||
      wineName.includes('sherry') ||
      wineName.includes('madeira') ||
      wineName.includes('moscatel') ||
      wineName.includes('tokaji')) {
    wineType = 'dessert';
  }
  
  // Select appropriate image from the category
  const imageUrl = wineImagesByType[wineType][Math.floor(Math.random() * wineImagesByType[wineType].length)];
  
  return { wineType, imageUrl };
};

// Mock database of wines - will be used as fallback if API fails
const mockWines: WineInfo[] = [
  {
    id: 'wine-001',
    name: 'Château Margaux 2015',
    winery: 'Château Margaux',
    year: 2015,
    region: 'Bordeaux',
    country: 'France',
    price: 120,
    marketPrice: 180,
    rating: 96,
    valueScore: 85,
    imageUrl: ''
  },
  {
    id: 'wine-002',
    name: 'Opus One 2018',
    winery: 'Opus One Winery',
    year: 2018,
    region: 'Napa Valley',
    country: 'USA',
    price: 110,
    marketPrice: 150,
    rating: 95,
    valueScore: 80,
    imageUrl: ''
  },
  {
    id: 'wine-003',
    name: 'Sassicaia 2016',
    winery: 'Tenuta San Guido',
    year: 2016,
    region: 'Tuscany',
    country: 'Italy',
    price: 105,
    marketPrice: 160,
    rating: 94,
    valueScore: 78,
    imageUrl: ''
  },
  {
    id: 'wine-004',
    name: 'Dom Pérignon 2012',
    winery: 'Moët & Chandon',
    year: 2012,
    region: 'Champagne',
    country: 'France',
    price: 180,
    marketPrice: 250,
    rating: 97,
    valueScore: 88,
    imageUrl: ''
  },
  {
    id: 'wine-005',
    name: 'Penfolds Grange 2017',
    winery: 'Penfolds',
    year: 2017,
    region: 'South Australia',
    country: 'Australia',
    price: 95,
    marketPrice: 140,
    rating: 93,
    valueScore: 76,
    imageUrl: ''
  },
  {
    id: 'wine-006',
    name: 'Cloudy Bay Sauvignon Blanc 2021',
    winery: 'Cloudy Bay Vineyards',
    year: 2021,
    region: 'Marlborough',
    country: 'New Zealand',
    price: 30,
    marketPrice: 45,
    rating: 90,
    valueScore: 82,
    imageUrl: ''
  },
  {
    id: 'wine-007',
    name: 'Tignanello 2019',
    winery: 'Antinori',
    year: 2019,
    region: 'Tuscany',
    country: 'Italy',
    price: 80,
    marketPrice: 110,
    rating: 92,
    valueScore: 74,
    imageUrl: ''
  },
  {
    id: 'wine-008',
    name: 'Ridge Monte Bello 2018',
    winery: 'Ridge Vineyards',
    year: 2018,
    region: 'Santa Cruz Mountains',
    country: 'USA',
    price: 100,
    marketPrice: 150,
    rating: 94,
    valueScore: 79,
    imageUrl: ''
  },
  {
    id: 'wine-009',
    name: 'Egon Müller Scharzhofberger Riesling 2020',
    winery: 'Egon Müller',
    year: 2020,
    region: 'Mosel',
    country: 'Germany',
    price: 350,
    marketPrice: 500,
    rating: 98,
    valueScore: 90,
    imageUrl: ''
  },
  {
    id: 'wine-010',
    name: 'Château d\'Yquem 2017',
    winery: 'Château d\'Yquem',
    year: 2017,
    region: 'Bordeaux',
    country: 'France',
    price: 400,
    marketPrice: 600,
    rating: 97,
    valueScore: 86,
    imageUrl: ''
  },
];

/**
 * Connects to Wine-Searcher API to search for wines
 * Falls back to mock data if API is not available
 */
export const searchWines = async (query?: string): Promise<WineInfo[]> => {
  console.log('Searching for wines:', query);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // If real wine API is disabled in config or no API key is available, use mock data
  if (!config.features.enableRealWineApi) {
    console.log('Using mock wine data');
    return processMockWineData(query);
  }
  
  // Try to call the real Wine-Searcher API
  try {
    console.log('Calling Wine-Searcher API');
    const apiKey = 'YOUR_WINE_SEARCHER_API_KEY'; // Replace with your Wine-Searcher API key
    
    const response = await fetch('https://api.wine-searcher.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey
      },
      body: JSON.stringify({
        query: query || '',
        limit: 20,
        additional_fields: ['rating', 'region', 'country', 'price', 'market_price', 'image_url', 'winery']
      })
    });
    
    if (!response.ok) {
      console.error('Wine-Searcher API error:', response.status);
      // Fall back to mock data on API error
      return processMockWineData(query);
    }
    
    const data = await response.json();
    
    if (!data.wines || !Array.isArray(data.wines)) {
      console.log('Invalid response from Wine-Searcher API, falling back to mock data');
      return processMockWineData(query);
    }
    
    // Transform API response to our WineInfo format
    const wines: WineInfo[] = data.wines.map((wine: any) => {
      // Calculate value score
      const price = wine.price || 100;
      const marketPrice = wine.market_price || price * 1.2;
      const rating = wine.rating || 90;
      
      const priceDifferencePercent = (marketPrice - price) / marketPrice;
      const valueScore = Math.round(
        (priceDifferencePercent * 50) + // Price difference component (0-50)
        ((rating - 85) / 13 * 50)  // Quality component (0-50)
      );
      
      const { wineType, imageUrl: fallbackImage } = categorizeWine({
        ...wine,
        id: wine.id || `wine-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: wine.name || 'Unknown Wine',
        winery: wine.winery || 'Unknown Producer',
        year: wine.vintage || new Date().getFullYear() - 3,
        price,
        marketPrice,
        rating,
        valueScore,
        imageUrl: wine.image_url
      });
      
      return {
        id: wine.id || `wine-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: wine.name || 'Unknown Wine',
        winery: wine.winery || 'Unknown Producer',
        year: wine.vintage || new Date().getFullYear() - 3,
        region: wine.region || 'Unknown Region',
        country: wine.country || 'Unknown Country',
        price,
        marketPrice,
        rating,
        valueScore,
        wineType,
        imageUrl: wine.image_url || fallbackImage
      };
    });
    
    console.log(`Found ${wines.length} wines from Wine-Searcher API`);
    return wines;
  } catch (error) {
    console.error('Error fetching wines from Wine-Searcher API:', error);
    // Fall back to mock data on exception
    return processMockWineData(query);
  }
};

/**
 * Process mock wine data when API is unavailable
 */
const processMockWineData = (query?: string): WineInfo[] => {
  // If query is provided, filter results
  const wines = query 
    ? mockWines.filter(wine => {
        const searchTerm = query.toLowerCase();
        return (
          wine.name.toLowerCase().includes(searchTerm) ||
          wine.winery.toLowerCase().includes(searchTerm) ||
          wine.region.toLowerCase().includes(searchTerm) ||
          wine.country.toLowerCase().includes(searchTerm)
        );
      })
    : mockWines;
  
  // Assign appropriate wine images and types based on name
  return wines.map(wine => {
    const { wineType, imageUrl } = categorizeWine(wine);
    return {
      ...wine,
      wineType,
      imageUrl: wine.imageUrl || imageUrl
    };
  });
};

/**
 * Get a specific wine by ID from Wine-Searcher API
 */
export const getWineById = async (id: string): Promise<WineInfo | null> => {
  console.log('Getting wine by ID:', id);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!config.features.enableRealWineApi) {
    console.log('Using mock wine data for ID lookup');
    return getMockWineById(id);
  }
  
  try {
    console.log('Calling Wine-Searcher API for wine details');
    const apiKey = 'YOUR_WINE_SEARCHER_API_KEY'; // Replace with your Wine-Searcher API key
    
    const response = await fetch(`https://api.wine-searcher.com/wines/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey
      }
    });
    
    if (!response.ok) {
      console.error('Wine-Searcher API error:', response.status);
      // Fall back to mock data on API error
      return getMockWineById(id);
    }
    
    const wine = await response.json();
    
    if (!wine || !wine.id) {
      console.log('Invalid response from Wine-Searcher API, falling back to mock data');
      return getMockWineById(id);
    }
    
    // Calculate value score
    const price = wine.price || 100;
    const marketPrice = wine.market_price || price * 1.2;
    const rating = wine.rating || 90;
    
    const priceDifferencePercent = (marketPrice - price) / marketPrice;
    const valueScore = Math.round(
      (priceDifferencePercent * 50) + // Price difference component (0-50)
      ((rating - 85) / 13 * 50)  // Quality component (0-50)
    );
    
    const { wineType, imageUrl: fallbackImage } = categorizeWine({
      ...wine,
      id: wine.id,
      name: wine.name || 'Unknown Wine',
      winery: wine.winery || 'Unknown Producer',
      year: wine.vintage || new Date().getFullYear() - 3,
      price,
      marketPrice,
      rating,
      valueScore,
      imageUrl: wine.image_url
    });
    
    return {
      id: wine.id,
      name: wine.name || 'Unknown Wine',
      winery: wine.winery || 'Unknown Producer',
      year: wine.vintage || new Date().getFullYear() - 3,
      region: wine.region || 'Unknown Region',
      country: wine.country || 'Unknown Country',
      price,
      marketPrice,
      rating,
      valueScore,
      wineType,
      imageUrl: wine.image_url || fallbackImage
    };
  } catch (error) {
    console.error('Error fetching wine details from Wine-Searcher API:', error);
    // Fall back to mock data on exception
    return getMockWineById(id);
  }
};

/**
 * Get mock wine by ID when API is unavailable
 */
const getMockWineById = (id: string): WineInfo | null => {
  const wine = mockWines.find(w => w.id === id) || null;
  
  if (wine) {
    const { wineType, imageUrl } = categorizeWine(wine);
    return {
      ...wine,
      wineType,
      imageUrl: wine.imageUrl || imageUrl
    };
  }
  
  return null;
};
