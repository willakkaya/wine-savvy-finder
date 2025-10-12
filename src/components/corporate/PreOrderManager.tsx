import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Calendar, Users, DollarSign, Wine, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface PreOrder {
  id: string;
  dinner_date: string;
  num_guests: number;
  total_budget: number;
  status: string;
  special_requests?: string;
  created_at: string;
  restaurants: {
    name: string;
    address: string;
    city: string;
  };
  pre_order_wines: Array<{
    quantity: number;
    price_per_bottle: number;
    wine_database: {
      name: string;
      winery: string;
      vintage?: number;
    };
  }>;
}

export const PreOrderManager: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<PreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [corporateAccountId, setCorporateAccountId] = useState<string | null>(null);

  useEffect(() => {
    fetchCorporateAccount();
  }, [user]);

  useEffect(() => {
    if (corporateAccountId) {
      fetchOrders();
    }
  }, [corporateAccountId]);

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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pre_orders')
        .select(`
          *,
          restaurants (name, address, city),
          pre_order_wines (
            quantity,
            price_per_bottle,
            wine_database (name, winery, vintage)
          )
        `)
        .eq('corporate_account_id', corporateAccountId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'confirmed':
        return 'secondary';
      case 'completed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Wine className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No pre-orders yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Start by creating your first wine pre-order
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {order.restaurants.name}
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {order.restaurants.address}, {order.restaurants.city}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Dinner Date</p>
                  <p className="font-medium">
                    {format(new Date(order.dinner_date), 'PPP')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Guests</p>
                  <p className="font-medium">{order.num_guests}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium">${order.total_budget.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {order.pre_order_wines.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Wines Ordered</h4>
                <div className="space-y-1">
                  {order.pre_order_wines.map((wine, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>
                        {wine.quantity}x {wine.wine_database.name} ({wine.wine_database.winery}
                        {wine.wine_database.vintage && ` ${wine.wine_database.vintage}`})
                      </span>
                      <span className="font-medium">
                        ${(wine.quantity * wine.price_per_bottle).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {order.special_requests && (
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Special Requests</h4>
                <p className="text-sm text-muted-foreground">{order.special_requests}</p>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Ordered on {format(new Date(order.created_at), 'PPP')}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
