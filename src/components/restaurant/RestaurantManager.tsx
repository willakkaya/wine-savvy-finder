
import React, { useState, useEffect } from 'react';
import { Restaurant } from '@/types/restaurantTypes';
import { RestaurantWineService } from '@/utils/restaurantWineService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, MapPin, Phone, Globe } from 'lucide-react';

interface RestaurantManagerProps {
  restaurant?: any;
  onUpdate?: () => void;
}

const RestaurantManager: React.FC<RestaurantManagerProps> = ({ restaurant: propRestaurant, onUpdate }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    neighborhood: '',
    zipCode: '',
    phone: '',
    website: '',
    cuisine_type: '',
    price_range: 2 as 1 | 2 | 3 | 4
  });

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await RestaurantWineService.getBayAreaRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      toast.error('Failed to load restaurants');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.city) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      await RestaurantWineService.addRestaurant({
        ...formData,
        is_verified: false
      });
      
      toast.success('Restaurant added successfully!');
      setShowAddForm(false);
      setFormData({
        name: '',
        address: '',
        city: '',
        neighborhood: '',
        zipCode: '',
        phone: '',
        website: '',
        cuisine_type: '',
        price_range: 2
      });
      loadRestaurants();
    } catch (error) {
      console.error('Error adding restaurant:', error);
      toast.error('Failed to add restaurant');
    }
  };

  const priceRangeDisplay = (range: number) => {
    return '$'.repeat(range);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Bay Area Restaurants</h2>
          <p className="text-muted-foreground">Manage the restaurant database for wine price tracking</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} className="mr-2" />
          Add Restaurant
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Restaurant</CardTitle>
            <CardDescription>Add a restaurant to start tracking their wine prices</CardDescription>
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
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                    placeholder="94103"
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
                  <Select
                    value={formData.price_range.toString()}
                    onValueChange={(value) => setFormData({...formData, price_range: parseInt(value) as 1 | 2 | 3 | 4})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">$ - Budget</SelectItem>
                      <SelectItem value="2">$$ - Moderate</SelectItem>
                      <SelectItem value="3">$$$ - Upscale</SelectItem>
                      <SelectItem value="4">$$$$ - Fine Dining</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Add Restaurant</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {restaurant.name}
                <span className="text-sm font-normal text-muted-foreground">
                  {priceRangeDisplay(restaurant.price_range)}
                </span>
              </CardTitle>
              {restaurant.cuisine_type && (
                <CardDescription>{restaurant.cuisine_type}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} />
                <span>{restaurant.address}, {restaurant.city}</span>
              </div>
              {restaurant.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} />
                  <span>{restaurant.phone}</span>
                </div>
              )}
              {restaurant.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe size={14} />
                  <a href={restaurant.website} target="_blank" rel="noopener noreferrer" 
                     className="text-wine hover:underline">
                    Website
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {restaurants.length === 0 && !showAddForm && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">No restaurants added yet</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus size={16} className="mr-2" />
              Add Your First Restaurant
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RestaurantManager;
