
import { WineInfo } from '@/components/wine/WineCard';
import { RestaurantWineService } from './restaurantWineService';

/**
 * Enhanced wine API that searches across Bay Area restaurants
 */
export const searchBayAreaWines = async (query?: string): Promise<WineInfo[]> => {
  console.log('Searching Bay Area wines:', query);
  
  if (!query) {
    // Return best deals if no query
    const deals = await RestaurantWineService.getBestDeals(20);
    return deals.map(deal => ({
      id: deal.wine.id,
      name: deal.wine.name,
      winery: deal.wine.winery,
      year: deal.wine.vintage,
      region: deal.wine.region,
      country: deal.wine.country,
      price: deal.current_price,
      marketPrice: deal.market_price_estimate,
      rating: deal.wine.critic_score || 90,
      valueScore: deal.savings_percentage,
      imageUrl: deal.wine.image_url,
      wineType: deal.wine.wine_type
    }));
  }
  
  try {
    const searchResults = await RestaurantWineService.searchWinesAcrossRestaurants(query);
    
    return searchResults.flatMap(result => 
      result.restaurants.map(restaurant => ({
        id: `${result.wine.id}-${restaurant.restaurant.id}`,
        name: result.wine.name,
        winery: result.wine.winery,
        year: result.wine.vintage,
        region: result.wine.region,
        country: result.wine.country,
        price: restaurant.price,
        marketPrice: result.wine.market_price_estimate || restaurant.price * 1.3,
        rating: result.wine.critic_score || 90,
        valueScore: result.wine.market_price_estimate ? 
          Math.round(((result.wine.market_price_estimate - restaurant.price) / result.wine.market_price_estimate) * 100) :
          75,
        imageUrl: result.wine.image_url,
        wineType: result.wine.wine_type,
        restaurantName: restaurant.restaurant.name,
        restaurantAddress: `${restaurant.restaurant.address}, ${restaurant.restaurant.city}`
      }))
    );
  } catch (error) {
    console.error('Error searching Bay Area wines:', error);
    return [];
  }
};

/**
 * Get wine deals by neighborhood
 */
export const getWinesByNeighborhood = async (neighborhood: string): Promise<WineInfo[]> => {
  // This would filter restaurants by neighborhood and return their wines
  // Implementation would depend on your database structure
  console.log('Getting wines by neighborhood:', neighborhood);
  return [];
};

/**
 * Compare wine prices across restaurants
 */
export const compareWinePrices = async (wineName: string): Promise<Array<{
  restaurant: string;
  price: number;
  address: string;
}>> => {
  const searchResults = await RestaurantWineService.searchWinesAcrossRestaurants(wineName);
  
  if (searchResults.length === 0) return [];
  
  const firstWine = searchResults[0];
  return firstWine.restaurants.map(rest => ({
    restaurant: rest.restaurant.name,
    price: rest.price,
    address: `${rest.restaurant.address}, ${rest.restaurant.city}`
  }));
};
