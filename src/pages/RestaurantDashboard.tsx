import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Wine, DollarSign, Package } from 'lucide-react';
import RestaurantManager from '@/components/restaurant/RestaurantManager';

const RestaurantDashboard = () => {
  const { user, hasRole, loading } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [wineCount, setWineCount] = useState(0);
  const [preOrderCount, setPreOrderCount] = useState(0);

  useEffect(() => {
    if (!loading && !hasRole('restaurant_partner')) {
      toast.error('Access denied', {
        description: 'You need restaurant partner access to view this page'
      });
      navigate('/');
    }
  }, [loading, hasRole, navigate]);

  useEffect(() => {
    if (user) {
      fetchRestaurantData();
    }
  }, [user]);

  const fetchRestaurantData = async () => {
    try {
      // Get restaurant
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user?.id)
        .single();

      if (restaurantError) throw restaurantError;
      setRestaurant(restaurantData);

      // Get wine count
      const { count: wineCountData, error: wineError } = await supabase
        .from('restaurant_wines')
        .select('*', { count: 'exact', head: true })
        .eq('restaurant_id', restaurantData.id);

      if (wineError) throw wineError;
      setWineCount(wineCountData || 0);

      // Get pre-order count
      const { count: preOrderCountData, error: preOrderError } = await supabase
        .from('pre_orders')
        .select('*', { count: 'exact', head: true })
        .eq('restaurant_id', restaurantData.id)
        .eq('status', 'pending');

      if (preOrderError) throw preOrderError;
      setPreOrderCount(preOrderCountData || 0);

    } catch (error: any) {
      console.error('Error fetching restaurant data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  if (loading) {
    return (
      <PageContainer title="Restaurant Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Restaurant Dashboard">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif">Restaurant Dashboard</h1>
            {restaurant && (
              <p className="text-muted-foreground mt-1">{restaurant.name}</p>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wines Listed</CardTitle>
              <Wine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wineCount}</div>
              <p className="text-xs text-muted-foreground">Active wine offerings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Pre-Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{preOrderCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partner Status</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {restaurant?.is_partner ? 'Active' : 'Inactive'}
              </div>
              <p className="text-xs text-muted-foreground">
                {restaurant?.subscription_tier || 'No subscription'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Restaurant Info</TabsTrigger>
            <TabsTrigger value="wines">Wine List</TabsTrigger>
            <TabsTrigger value="orders">Pre-Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <RestaurantManager restaurant={restaurant} onUpdate={fetchRestaurantData} />
          </TabsContent>

          <TabsContent value="wines" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Wine List Management</CardTitle>
                    <CardDescription>Manage your restaurant's wine offerings</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Wine
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Wine list management coming soon. You'll be able to add, edit, and manage your wine inventory.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pre-Orders</CardTitle>
                <CardDescription>Manage corporate pre-orders for wine selections</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Pre-order management coming soon. You'll be able to review and confirm wine selections for corporate events.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default RestaurantDashboard;
