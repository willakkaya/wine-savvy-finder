import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Wine, Plus, Minus, ShoppingCart, Calendar, Users, ArrowLeft } from 'lucide-react';

interface WineWithDetails {
  id: string;
  restaurant_id: string;
  wine_id: string;
  current_price: number;
  by_glass_price?: number;
  is_available: boolean;
  section?: string;
  wine_database: {
    id: string;
    name: string;
    winery: string;
    vintage?: number;
    wine_type: string;
    region?: string;
    country?: string;
    image_url?: string;
  };
}

interface CartItem {
  restaurantWineId: string;
  wineId: string;
  wineName: string;
  winery: string;
  vintage?: number;
  price: number;
  quantity: number;
}

interface PreOrderFormProps {
  restaurantId: string;
  restaurantName: string;
  onBack: () => void;
}

export const PreOrderForm: React.FC<PreOrderFormProps> = ({ restaurantId, restaurantName, onBack }) => {
  const { user } = useAuth();
  const [wines, setWines] = useState<WineWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Order details
  const [dinnerDate, setDinnerDate] = useState('');
  const [numGuests, setNumGuests] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [corporateAccountId, setCorporateAccountId] = useState<string | null>(null);

  useEffect(() => {
    fetchWines();
    fetchCorporateAccount();
  }, [restaurantId]);

  const fetchCorporateAccount = async () => {
    try {
      const { data, error } = await supabase
        .from('corporate_accounts')
        .select('id')
        .eq('admin_id', user?.id)
        .single();

      if (error) throw error;
      setCorporateAccountId(data.id);
    } catch (error: any) {
      console.error('Error fetching corporate account:', error);
    }
  };

  const fetchWines = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('restaurant_wines')
        .select(`
          *,
          wine_database (*)
        `)
        .eq('restaurant_id', restaurantId)
        .eq('is_available', true)
        .order('section', { ascending: true });

      if (error) throw error;
      setWines(data || []);
    } catch (error: any) {
      console.error('Error fetching wines:', error);
      toast.error('Failed to load wine list');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (wine: WineWithDetails) => {
    const existingItem = cart.find(item => item.restaurantWineId === wine.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.restaurantWineId === wine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        restaurantWineId: wine.id,
        wineId: wine.wine_id,
        wineName: wine.wine_database.name,
        winery: wine.wine_database.winery,
        vintage: wine.wine_database.vintage,
        price: wine.current_price,
        quantity: 1,
      }]);
    }
    toast.success('Added to order');
  };

  const updateQuantity = (restaurantWineId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.restaurantWineId === restaurantWineId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmitOrder = async () => {
    if (!corporateAccountId) {
      toast.error('Corporate account not found');
      return;
    }

    if (cart.length === 0) {
      toast.error('Please add wines to your order');
      return;
    }

    if (!dinnerDate || !numGuests) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      // Create the pre-order
      const { data: preOrder, error: orderError } = await supabase
        .from('pre_orders')
        .insert({
          corporate_account_id: corporateAccountId,
          restaurant_id: restaurantId,
          ordered_by: user?.id,
          dinner_date: dinnerDate,
          num_guests: parseInt(numGuests),
          total_budget: totalAmount,
          special_requests: specialRequests || null,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create the order items
      const orderItems = cart.map(item => ({
        pre_order_id: preOrder.id,
        wine_id: item.wineId,
        quantity: item.quantity,
        price_per_bottle: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('pre_order_wines')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast.success('Pre-order submitted successfully!');
      setCart([]);
      setDinnerDate('');
      setNumGuests('');
      setSpecialRequests('');
      onBack();
    } catch (error: any) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit order');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredWines = wines.filter(wine =>
    wine.wine_database.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wine.wine_database.winery.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading wine list...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-serif">{restaurantName}</h2>
          <p className="text-sm text-muted-foreground">Select wines for your pre-order</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wine List */}
        <div className="lg:col-span-2 space-y-4">
          <Input
            placeholder="Search wines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="space-y-4">
            {filteredWines.map((wine) => (
              <Card key={wine.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{wine.wine_database.name}</h3>
                      <p className="text-sm text-muted-foreground">{wine.wine_database.winery}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {wine.wine_database.vintage && (
                          <Badge variant="outline">{wine.wine_database.vintage}</Badge>
                        )}
                        <Badge variant="secondary">{wine.wine_database.wine_type}</Badge>
                        {wine.section && (
                          <Badge variant="outline">{wine.section}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">${wine.current_price}</p>
                      <Button
                        size="sm"
                        onClick={() => addToCart(wine)}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary & Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No wines added yet
                </p>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.restaurantWineId} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <div className="flex-1">
                            <p className="font-medium">{item.wineName}</p>
                            <p className="text-muted-foreground text-xs">{item.winery}</p>
                          </div>
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.restaurantWineId, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.restaurantWineId, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dinnerDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Dinner Date
                </Label>
                <Input
                  id="dinnerDate"
                  type="datetime-local"
                  value={dinnerDate}
                  onChange={(e) => setDinnerDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numGuests" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Number of Guests
                </Label>
                <Input
                  id="numGuests"
                  type="number"
                  min="1"
                  value={numGuests}
                  onChange={(e) => setNumGuests(e.target.value)}
                  placeholder="Enter number of guests"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any dietary restrictions, preferences, or special requests..."
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSubmitOrder}
                disabled={submitting || cart.length === 0}
                className="w-full"
              >
                <Wine className="h-4 w-4 mr-2" />
                {submitting ? 'Submitting...' : 'Submit Pre-Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
