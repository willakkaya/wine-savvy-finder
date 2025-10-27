import { supabase } from '@/integrations/supabase/client';

export interface Restaurant {
  id: string;
  owner_id: string | null;
  name: string;
  address: string;
  city: string;
  neighborhood?: string;
  zip_code: string;
  phone?: string;
  website?: string;
  cuisine_type?: string;
  price_range: number;
  is_partner: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WineDatabase {
  id: string;
  name: string;
  winery: string;
  vintage: number | null;
  region: string | null;
  country: string | null;
  wine_type: string | null;
  grape_varieties?: string[];
  alcohol_content?: number;
  bottle_size?: string;
  market_price_estimate?: number;
  critic_score?: number;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface RestaurantWine {
  id: string;
  restaurant_id: string;
  wine_id: string;
  current_price: number;
  by_glass_price?: number;
  is_available: boolean;
  date_added: string;
  date_updated: string;
  section?: string;
  notes?: string;
}

/**
 * Service for managing restaurant wine data
 */
export class RestaurantWineService {
  /**
   * Get all active partner restaurants
   */
  static async getBayAreaRestaurants(): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_partner', true)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  /**
   * Get restaurants owned by current user
   */
  static async getMyRestaurants(): Promise<Restaurant[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('owner_id', user.id)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  /**
   * Add wine to a restaurant's list
   */
  static async addWineToRestaurant(
    restaurantId: string,
    wine: Omit<WineDatabase, 'id' | 'created_at' | 'updated_at'>,
    price: number,
    byGlassPrice?: number,
    section?: string,
    notes?: string
  ): Promise<{ wine: WineDatabase; restaurantWine: RestaurantWine }> {
    // Find or create wine
    let wineRecord = await this.findOrCreateWine(wine);

    // Create restaurant wine entry
    const { data: restaurantWine, error } = await supabase
      .from('restaurant_wines')
      .insert({
        restaurant_id: restaurantId,
        wine_id: wineRecord.id,
        current_price: price,
        by_glass_price: byGlassPrice,
        section,
        notes,
        is_available: true
      })
      .select()
      .single();

    if (error) throw error;

    return { wine: wineRecord, restaurantWine };
  }

  /**
   * Update wine availability
   */
  static async updateWineAvailability(
    restaurantWineId: string,
    isAvailable: boolean
  ): Promise<void> {
    const { error } = await supabase
      .from('restaurant_wines')
      .update({ is_available: isAvailable })
      .eq('id', restaurantWineId);

    if (error) throw error;
  }

  /**
   * Update wine price
   */
  static async updateWinePrice(
    restaurantWineId: string,
    newPrice: number,
    byGlassPrice?: number
  ): Promise<void> {
    const { error } = await supabase
      .from('restaurant_wines')
      .update({
        current_price: newPrice,
        by_glass_price: byGlassPrice,
        date_updated: new Date().toISOString()
      })
      .eq('id', restaurantWineId);

    if (error) throw error;
  }

  /**
   * Get wines for a specific restaurant
   */
  static async getRestaurantWines(restaurantId: string): Promise<Array<{
    restaurantWine: RestaurantWine;
    wine: WineDatabase;
  }>> {
    const { data, error } = await supabase
      .from('restaurant_wines')
      .select(`
        *,
        wine:wine_database(*)
      `)
      .eq('restaurant_id', restaurantId)
      .order('date_added', { ascending: false });

    if (error) throw error;

    return data.map((item: any) => ({
      restaurantWine: {
        id: item.id,
        restaurant_id: item.restaurant_id,
        wine_id: item.wine_id,
        current_price: item.current_price,
        by_glass_price: item.by_glass_price,
        is_available: item.is_available,
        date_added: item.date_added,
        date_updated: item.date_updated,
        section: item.section,
        notes: item.notes
      },
      wine: item.wine
    }));
  }

  /**
   * Search wines across all restaurants
   */
  static async searchWinesAcrossRestaurants(query: string): Promise<Array<{
    wine: WineDatabase;
    restaurants: Array<{
      restaurant: Restaurant;
      price: number;
      section?: string;
    }>;
  }>> {
    const searchTerm = `%${query}%`;

    const { data: wines, error: wineError } = await supabase
      .from('wine_database')
      .select('*')
      .or(`name.ilike.${searchTerm},winery.ilike.${searchTerm},region.ilike.${searchTerm}`);

    if (wineError) throw wineError;

    const results = await Promise.all(
      (wines || []).map(async (wine) => {
        const { data: restaurantWines } = await supabase
          .from('restaurant_wines')
          .select(`
            *,
            restaurant:restaurants(*)
          `)
          .eq('wine_id', wine.id)
          .eq('is_available', true);

        const restaurants = (restaurantWines || [])
          .filter((rw: any) => rw.restaurant)
          .map((rw: any) => ({
            restaurant: rw.restaurant,
            price: rw.current_price,
            section: rw.section
          }))
          .sort((a, b) => a.price - b.price);

        return {
          wine,
          restaurants
        };
      })
    );

    return results.filter(r => r.restaurants.length > 0);
  }

  /**
   * Get best wine deals
   */
  static async getBestDeals(limit: number = 20): Promise<Array<{
    wine: WineDatabase;
    restaurant: Restaurant;
    current_price: number;
    market_price_estimate?: number;
    savings_percentage?: number;
  }>> {
    const { data: restaurantWines, error } = await supabase
      .from('restaurant_wines')
      .select(`
        *,
        wine:wine_database(*),
        restaurant:restaurants(*)
      `)
      .eq('is_available', true)
      .not('wine.market_price_estimate', 'is', null);

    if (error) throw error;

    const deals = (restaurantWines || [])
      .map((item: any) => {
        const wine = item.wine;
        const restaurant = item.restaurant;

        if (!wine || !restaurant || !wine.market_price_estimate) return null;

        const savings_percentage = ((wine.market_price_estimate - item.current_price) / wine.market_price_estimate) * 100;

        return {
          wine,
          restaurant,
          current_price: item.current_price,
          market_price_estimate: wine.market_price_estimate,
          savings_percentage
        };
      })
      .filter((deal): deal is NonNullable<typeof deal> => deal !== null && deal.savings_percentage > 10)
      .sort((a, b) => b.savings_percentage - a.savings_percentage)
      .slice(0, limit);

    return deals;
  }

  /**
   * Find existing wine or create new one
   */
  private static async findOrCreateWine(wineData: Omit<WineDatabase, 'id' | 'created_at' | 'updated_at'>): Promise<WineDatabase> {
    // Try to find existing wine
    const { data: existingWines } = await supabase
      .from('wine_database')
      .select('*')
      .ilike('name', wineData.name)
      .ilike('winery', wineData.winery)
      .eq('vintage', wineData.vintage);

    if (existingWines && existingWines.length > 0) {
      return existingWines[0];
    }

    // Create new wine
    const { data: newWine, error } = await supabase
      .from('wine_database')
      .insert(wineData)
      .select()
      .single();

    if (error) throw error;
    return newWine;
  }
}
