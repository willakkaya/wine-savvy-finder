import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Calendar, Users, DollarSign, Wine, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PreOrder {
  id: string;
  dinner_date: string;
  num_guests: number;
  total_budget: number;
  status: string;
  special_requests?: string;
  created_at: string;
  corporate_accounts: {
    company_name: string;
  };
  profiles: {
    full_name: string;
    email: string;
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

interface PreOrderListProps {
  restaurantId: string;
}

export const PreOrderList: React.FC<PreOrderListProps> = ({ restaurantId }) => {
  const [orders, setOrders] = useState<PreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, [restaurantId, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('pre_orders')
        .select(`
          *,
          corporate_accounts (company_name),
          profiles (full_name, email),
          pre_order_wines (
            quantity,
            price_per_bottle,
            wine_database (name, winery, vintage)
          )
        `)
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching pre-orders:', error);
      toast.error('Failed to load pre-orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('pre_orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast.success(`Order ${newStatus}`);
      fetchOrders();
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Incoming Pre-Orders</h3>
          <p className="text-sm text-muted-foreground">
            Manage wine pre-orders from corporate clients
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Wine className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No pre-orders found</p>
            <p className="text-sm text-muted-foreground mt-2">
              {statusFilter !== 'all' 
                ? `No ${statusFilter} orders at this time`
                : 'Pre-orders from corporate clients will appear here'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {order.corporate_accounts.company_name}
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Ordered by: {order.profiles.full_name} ({order.profiles.email})
                    </CardDescription>
                  </div>
                  {order.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                  {order.status === 'confirmed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                    >
                      Mark Complete
                    </Button>
                  )}
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
                        <div key={idx} className="flex justify-between text-sm bg-muted/50 p-2 rounded">
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
                    <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                      {order.special_requests}
                    </p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Order received {format(new Date(order.created_at), 'PPP')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
