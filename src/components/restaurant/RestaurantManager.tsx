
import React, { useState, useEffect } from 'react';
import { RestaurantWineService } from '@/utils/restaurantWineService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MapPin, Phone, Globe, Building } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface RestaurantManagerProps {
  restaurant?: any;
  onUpdate?: () => void;
}

const RestaurantManager: React.FC<RestaurantManagerProps> = ({ restaurant: propRestaurant, onUpdate }) => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(propRestaurant);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: propRestaurant?.name || '',
    address: propRestaurant?.address || '',
    city: propRestaurant?.city || '',
    neighborhood: propRestaurant?.neighborhood || '',
    zip_code: propRestaurant?.zip_code || '',
    phone: propRestaurant?.phone || '',
    website: propRestaurant?.website || '',
    cuisine_type: propRestaurant?.cuisine_type || '',
    price_range: propRestaurant?.price_range || 2
  });

  useEffect(() => {
    if (propRestaurant) {
      setRestaurant(propRestaurant);
      setFormData({
        name: propRestaurant.name || '',
        address: propRestaurant.address || '',
        city: propRestaurant.city || '',
        neighborhood: propRestaurant.neighborhood || '',
        zip_code: propRestaurant.zip_code || '',
        phone: propRestaurant.phone || '',
        website: propRestaurant.website || '',
        cuisine_type: propRestaurant.cuisine_type || '',
        price_range: propRestaurant.price_range || 2
      });
    }
  }, [propRestaurant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.city || !formData.zip_code) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      if (restaurant?.id) {
        // Update existing restaurant
        const { error } = await supabase
          .from('restaurants')
          .update(formData)
          .eq('id', restaurant.id);

        if (error) throw error;
        toast.success('Restaurant updated successfully!');
      } else {
        // Create new restaurant (only for super admins)
        const { error } = await supabase
          .from('restaurants')
          .insert({
            ...formData,
            owner_id: user?.id,
            is_partner: false,
            is_active: true
          });

        if (error) throw error;
        toast.success('Restaurant created successfully!');
      }
      
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error('Error saving restaurant:', error);
      toast.error(error.message || 'Failed to save restaurant');
    }
  };

  const priceRangeDisplay = (range: number) => {
    return '$'.repeat(range);
  };

  if (!restaurant) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No restaurant information available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Restaurant Information</h2>
          <p className="text-muted-foreground">Manage your restaurant details</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Edit Information
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Restaurant Information</CardTitle>
            <CardDescription>Update your restaurant details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Restaurant Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Chez Panisse"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cuisine">Cuisine Type</Label>
                  <Input
                    id="cuisine"
                    value={formData.cuisine_type}
                    onChange={(e) => setFormData({...formData, cuisine_type: e.target.value})}
                    placeholder="e.g., French, Italian, American"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Street address"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="San Francisco"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="neighborhood">Neighborhood</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                    placeholder="e.g., Mission, SOMA"
                  />
                </div>
                <div>
                  <Label htmlFor="zip_code">Zip Code *</Label>
                  <Input
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
                    placeholder="94103"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://restaurant.com"
                  />
                </div>
                <div>
                  <Label>Price Range</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((range) => (
                      <Button
                        key={range}
                        type="button"
                        variant={formData.price_range === range ? 'default' : 'outline'}
                        onClick={() => setFormData({...formData, price_range: range})}
                      >
                        {'$'.repeat(range)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <CardTitle>{restaurant.name}</CardTitle>
            </div>
            {restaurant.cuisine_type && (
              <CardDescription>{restaurant.cuisine_type}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Address</Label>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={14} className="mt-1" />
                  <div>
                    <div>{restaurant.address}</div>
                    <div>{restaurant.city}, {restaurant.zip_code}</div>
                    {restaurant.neighborhood && (
                      <div className="text-muted-foreground">{restaurant.neighborhood}</div>
                    )}
                  </div>
                </div>
              </div>

              {restaurant.phone && (
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} />
                    <span>{restaurant.phone}</span>
                  </div>
                </div>
              )}

              {restaurant.website && (
                <div className="space-y-2">
                  <Label>Website</Label>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe size={14} />
                    <a 
                      href={restaurant.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline"
                    >
                      {restaurant.website}
                    </a>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="text-sm font-medium">
                  {'$'.repeat(restaurant.price_range)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RestaurantManager;
