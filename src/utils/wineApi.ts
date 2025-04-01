import { WineInfo } from '@/components/wine/WineCard';
import { config } from '@/lib/config';

// Wine image URLs by type
const wineImagesByType = {
  red: [
    "https://images.vivino.com/thumbs/4RHhCzeQTsCeyCScxO0LOw_pb_600x600.png",
    "https://images.vivino.com/thumbs/0667TG7tRnCvIrGLX2_8Jg_pb_600x600.png",
    "https://images.vivino.com/thumbs/uXOXvx3LSHSEDtyKULBF6Q_pb_600x600.png"
  ],
  white: [
    "https://images.vivino.com/thumbs/HvTvhmaGQ5-gIrKcbgQHsQ_pb_600x600.png",
    "https://images.vivino.com/thumbs/4vr20EL8TSCN_CGz72Znow_pb_600x600.png",
    "https://images.vivino.com/thumbs/SL38tG4lQoCELG-4DzTy0w_pb_600x600.png"
  ],
  sparkling: [
    "https://images.vivino.com/thumbs/pEVCVwqLQmOcUugEjfYqYg_pb_600x600.png",
    "https://images.vivino.com/thumbs/U19RXtSdRFKvQjS9LiQrzA_pb_600x600.png",
    "https://images.vivino.com/thumbs/T7M9fksIQNqsIADkiJ1K2g_pb_600x600.png"
  ],
  rose: [
    "https://images.vivino.com/thumbs/eEsJ2PN8R5KOFywDS5-aOQ_pb_600x600.png",
    "https://images.vivino.com/thumbs/1XYwrRMVSmSe6pQOA9CM3g_pb_600x600.png",
    "https://images.vivino.com/thumbs/XErqVQ0wSEmZc8QbMMzNpA_pb_600x600.png"
  ],
  dessert: [
    "https://images.vivino.com/thumbs/k6nJZXUcRfS1PGe-ZbqS8Q_pb_600x600.png",
    "https://images.vivino.com/thumbs/rKRnfpEMS-OkP6vwx-q3DQ_pb_600x600.png",
    "https://images.vivino.com/thumbs/kHEEgniCSBu3OVrOpiK0WA_pb_600x600.png"
  ]
};

// Helper function to get a random image for a wine based on its name/characteristics
const getWineImage = (wine: WineInfo): string => {
  const wineName = wine.name.toLowerCase();
  const winery = wine.winery.toLowerCase();
  
  // Attempt to determine wine type from name
  if (wineName.includes('red') || wineName.includes('cabernet') || wineName.includes('merlot') || 
      wineName.includes('pinot noir') || wineName.includes('syrah') || wineName.includes('zinfandel') ||
      wineName.includes('malbec') || wineName.includes('sangiovese')) {
    return wineImagesByType.red[Math.floor(Math.random() * wineImagesByType.red.length)];
  }
  
  if (wineName.includes('white') || wineName.includes('chardonnay') || wineName.includes('sauvignon blanc') || 
      wineName.includes('pinot grigio') || wineName.includes('riesling') || wineName.includes('moscato')) {
    return wineImagesByType.white[Math.floor(Math.random() * wineImagesByType.white.length)];
  }
  
  if (wineName.includes('champagne') || wineName.includes('sparkling') || wineName.includes('prosecco') ||
      wineName.includes('cava') || wineName.includes('brut')) {
    return wineImagesByType.sparkling[Math.floor(Math.random() * wineImagesByType.sparkling.length)];
  }
  
  if (wineName.includes('rosé') || wineName.includes('rose') || wineName.includes('blush')) {
    return wineImagesByType.rose[Math.floor(Math.random() * wineImagesByType.rose.length)];
  }
  
  if (wineName.includes('port') || wineName.includes('dessert') || wineName.includes('sweet') || 
      wineName.includes('fortified') || wineName.includes('sauternes')) {
    return wineImagesByType.dessert[Math.floor(Math.random() * wineImagesByType.dessert.length)];
  }
  
  // If we couldn't detect from the name, try winery or default to red
  if (winery.includes('champagne')) {
    return wineImagesByType.sparkling[Math.floor(Math.random() * wineImagesByType.sparkling.length)];
  }
  
  // Default to red if we can't determine
  return wineImagesByType.red[Math.floor(Math.random() * wineImagesByType.red.length)];
};

// Mock database of wines for development
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
    // Will be assigned in the searchWines function
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
 * Simulates an API call to search for wines
 * In a real app, this would call an external API
 */
export const searchWines = async (query?: string): Promise<WineInfo[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // If not using real API, return mock data
  if (!config.features.enableRealWineApi) {
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
    
    // Assign appropriate wine images based on name
    return wines.map(wine => ({
      ...wine,
      imageUrl: wine.imageUrl || getWineImage(wine)
    }));
  }
  
  // In a real implementation, this would call an actual API
  try {
    // Here we'd make a fetch call to a real wine API
    // For demo purposes, we'll just return the mock data
    return mockWines.map(wine => ({
      ...wine,
      imageUrl: wine.imageUrl || getWineImage(wine)
    }));
  } catch (error) {
    console.error('Error fetching wines:', error);
    return [];
  }
};

/**
 * Simulates an API call to get a wine by ID
 */
export const getWineById = async (id: string): Promise<WineInfo | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!config.features.enableRealWineApi) {
    const wine = mockWines.find(w => w.id === id) || null;
    
    if (wine) {
      return {
        ...wine,
        imageUrl: wine.imageUrl || getWineImage(wine)
      };
    }
    
    return null;
  }
  
  // In a real implementation, this would call an actual API
  try {
    // Here we'd make a fetch call to a real wine API
    // For demo, we'll use mock data
    const wine = mockWines.find(w => w.id === id) || null;
    
    if (wine) {
      return {
        ...wine,
        imageUrl: wine.imageUrl || getWineImage(wine)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching wine details:', error);
    return null;
  }
};
