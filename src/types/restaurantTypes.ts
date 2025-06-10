
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  neighborhood?: string;
  zipCode: string;
  phone?: string;
  website?: string;
  cuisine_type?: string;
  price_range: 1 | 2 | 3 | 4; // $ to $$$$
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestaurantWine {
  id: string;
  restaurant_id: string;
  wine_id: string;
  current_price: number;
  is_available: boolean;
  date_added: string;
  date_updated: string;
  section?: string; // 'by_glass', 'by_bottle', 'reserve', etc.
  notes?: string; // restaurant-specific notes
}

export interface WineDatabase {
  id: string;
  name: string;
  winery: string;
  vintage: number;
  region: string;
  country: string;
  wine_type: 'red' | 'white' | 'sparkling' | 'rose' | 'dessert';
  grape_varieties?: string[];
  alcohol_content?: number;
  bottle_size?: string; // '750ml', '1.5L', etc.
  market_price_estimate?: number;
  critic_score?: number;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface WinePriceHistory {
  id: string;
  restaurant_id: string;
  wine_id: string;
  price: number;
  date_recorded: string;
  source: 'manual' | 'scanned' | 'updated';
}

export interface ScanSession {
  id: string;
  restaurant_id?: string;
  user_id?: string;
  scan_date: string;
  image_url?: string;
  wines_found: number;
  status: 'processing' | 'completed' | 'failed';
  notes?: string;
}
