
import { Restaurant, RestaurantWine, WineDatabase, WinePriceHistory } from '@/types/restaurantTypes';

/**
 * Service for managing restaurant wine data and building the Bay Area wine database
 */
export class RestaurantWineService {
  private static baseUrl = '/api'; // Will be configured for your backend

  /**
   * Add a new restaurant to the database
   */
  static async addRestaurant(restaurant: Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>): Promise<Restaurant> {
    // This will be replaced with actual API call to your backend
    console.log('Adding restaurant:', restaurant);
    
    const newRestaurant: Restaurant = {
      ...restaurant,
      id: `restaurant-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Store in localStorage for now (will be replaced with backend)
    const restaurants = this.getStoredRestaurants();
    restaurants.push(newRestaurant);
    localStorage.setItem('bayarea_restaurants', JSON.stringify(restaurants));
    
    return newRestaurant;
  }

  /**
   * Get all restaurants in the Bay Area
   */
  static async getBayAreaRestaurants(): Promise<Restaurant[]> {
    // This will be replaced with actual API call
    return this.getStoredRestaurants();
  }

  /**
   * Add wine to a restaurant's list
   */
  static async addWineToRestaurant(
    restaurantId: string, 
    wine: Omit<WineDatabase, 'id' | 'created_at' | 'updated_at'>,
    price: number,
    section?: string
  ): Promise<{ wine: WineDatabase; restaurantWine: RestaurantWine }> {
    
    // Create or find existing wine
    let wineRecord = await this.findOrCreateWine(wine);
    
    // Create restaurant wine entry
    const restaurantWine: RestaurantWine = {
      id: `rest_wine-${Date.now()}`,
      restaurant_id: restaurantId,
      wine_id: wineRecord.id,
      current_price: price,
      is_available: true,
      date_added: new Date().toISOString(),
      date_updated: new Date().toISOString(),
      section
    };

    // Store in localStorage for now
    const restaurantWines = this.getStoredRestaurantWines();
    restaurantWines.push(restaurantWine);
    localStorage.setItem('restaurant_wines', JSON.stringify(restaurantWines));

    // Record price history
    await this.recordPriceHistory(restaurantId, wineRecord.id, price, 'manual');

    return { wine: wineRecord, restaurantWine };
  }

  /**
   * Find wines across all Bay Area restaurants
   */
  static async searchWinesAcrossRestaurants(query: string): Promise<Array<{
    wine: WineDatabase;
    restaurants: Array<{
      restaurant: Restaurant;
      price: number;
      section?: string;
    }>;
  }>> {
    const wines = this.getStoredWines();
    const restaurants = this.getStoredRestaurants();
    const restaurantWines = this.getStoredRestaurantWines();

    const searchTerm = query.toLowerCase();
    const matchingWines = wines.filter(wine => 
      wine.name.toLowerCase().includes(searchTerm) ||
      wine.winery.toLowerCase().includes(searchTerm) ||
      wine.region.toLowerCase().includes(searchTerm)
    );

    return matchingWines.map(wine => {
      const wineRestaurants = restaurantWines
        .filter(rw => rw.wine_id === wine.id && rw.is_available)
        .map(rw => {
          const restaurant = restaurants.find(r => r.id === rw.restaurant_id);
          return restaurant ? {
            restaurant,
            price: rw.current_price,
            section: rw.section
          } : null;
        })
        .filter(Boolean) as Array<{
          restaurant: Restaurant;
          price: number;
          section?: string;
        }>;

      return {
        wine,
        restaurants: wineRestaurants.sort((a, b) => a.price - b.price) // Sort by price
      };
    });
  }

  /**
   * Get best wine deals in the Bay Area
   */
  static async getBestDeals(limit: number = 20): Promise<Array<{
    wine: WineDatabase;
    restaurant: Restaurant;
    current_price: number;
    market_price_estimate?: number;
    savings_percentage?: number;
  }>> {
    const wines = this.getStoredWines();
    const restaurants = this.getStoredRestaurants();
    const restaurantWines = this.getStoredRestaurantWines().filter(rw => rw.is_available);

    const deals = restaurantWines
      .map(rw => {
        const wine = wines.find(w => w.id === rw.wine_id);
        const restaurant = restaurants.find(r => r.id === rw.restaurant_id);
        
        if (!wine || !restaurant || !wine.market_price_estimate) return null;

        const savings_percentage = ((wine.market_price_estimate - rw.current_price) / wine.market_price_estimate) * 100;
        
        return {
          wine,
          restaurant,
          current_price: rw.current_price,
          market_price_estimate: wine.market_price_estimate,
          savings_percentage
        };
      })
      .filter(Boolean)
      .filter(deal => deal!.savings_percentage! > 10) // Only deals with 10%+ savings
      .sort((a, b) => b!.savings_percentage! - a!.savings_percentage!)
      .slice(0, limit) as Array<{
        wine: WineDatabase;
        restaurant: Restaurant;
        current_price: number;
        market_price_estimate: number;
        savings_percentage: number;
      }>;

    return deals;
  }

  /**
   * Record price history for analytics
   */
  private static async recordPriceHistory(
    restaurantId: string, 
    wineId: string, 
    price: number, 
    source: 'manual' | 'scanned' | 'updated'
  ): Promise<void> {
    const priceHistory: WinePriceHistory = {
      id: `price_history-${Date.now()}`,
      restaurant_id: restaurantId,
      wine_id: wineId,
      price,
      date_recorded: new Date().toISOString(),
      source
    };

    const history = this.getStoredPriceHistory();
    history.push(priceHistory);
    localStorage.setItem('wine_price_history', JSON.stringify(history));
  }

  /**
   * Find existing wine or create new one
   */
  private static async findOrCreateWine(wineData: Omit<WineDatabase, 'id' | 'created_at' | 'updated_at'>): Promise<WineDatabase> {
    const wines = this.getStoredWines();
    
    // Try to find existing wine by name, winery, and vintage
    const existingWine = wines.find(w => 
      w.name.toLowerCase() === wineData.name.toLowerCase() &&
      w.winery.toLowerCase() === wineData.winery.toLowerCase() &&
      w.vintage === wineData.vintage
    );

    if (existingWine) {
      return existingWine;
    }

    // Create new wine
    const newWine: WineDatabase = {
      ...wineData,
      id: `wine-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    wines.push(newWine);
    localStorage.setItem('bayarea_wines', JSON.stringify(wines));

    return newWine;
  }

  // Helper methods for localStorage (will be replaced with actual database calls)
  private static getStoredRestaurants(): Restaurant[] {
    const stored = localStorage.getItem('bayarea_restaurants');
    return stored ? JSON.parse(stored) : [];
  }

  private static getStoredWines(): WineDatabase[] {
    const stored = localStorage.getItem('bayarea_wines');
    return stored ? JSON.parse(stored) : [];
  }

  private static getStoredRestaurantWines(): RestaurantWine[] {
    const stored = localStorage.getItem('restaurant_wines');
    return stored ? JSON.parse(stored) : [];
  }

  private static getStoredPriceHistory(): WinePriceHistory[] {
    const stored = localStorage.getItem('wine_price_history');
    return stored ? JSON.parse(stored) : [];
  }
}
