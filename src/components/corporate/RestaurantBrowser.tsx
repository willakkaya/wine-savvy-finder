import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MapPin, Phone, Globe, Search, Wine } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  neighborhood?: string;
  zip_code: string;
  phone?: string;
  website?: string;
  cuisine_type?: string;
  price_range?: number;
  is_partner: boolean;
  is_active: boolean;
}

interface RestaurantBrowserProps {
  onSelectRestaurant: (restaurantId: string, restaurantName: string) => void;
}

export const RestaurantBrowser: React.FC<RestaurantBrowserProps> = ({ onSelectRestaurant }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_partner', true)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error: any) {
      console.error('Error fetching restaurants:', error);
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.neighborhood?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriceRangeDisplay = (priceRange?: number) => {
    if (!priceRange) return '';
    return '$'.repeat(priceRange);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, neighborhood, or cuisine..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredRestaurants.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Wine className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No partner restaurants found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{restaurant.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {restaurant.cuisine_type && (
                        <span>{restaurant.cuisine_type}</span>
                      )}
                      {restaurant.price_range && (
                        <span className="ml-2">{getPriceRangeDisplay(restaurant.price_range)}</span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">Partner</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{restaurant.address}</p>
                      <p className="text-muted-foreground">
                        {restaurant.neighborhood && `${restaurant.neighborhood}, `}
                        {restaurant.city}, {restaurant.zip_code}
                      </p>
                    </div>
                  </div>
                  
                  {restaurant.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p>{restaurant.phone}</p>
                    </div>
                  )}
                  
                  {restaurant.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={restaurant.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={() => onSelectRestaurant(restaurant.id, restaurant.name)}
                  className="w-full"
                >
                  <Wine className="h-4 w-4 mr-2" />
                  View Wine List
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
