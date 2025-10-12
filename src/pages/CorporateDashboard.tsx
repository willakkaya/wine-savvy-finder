import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, DollarSign, Wine, Calendar } from 'lucide-react';
import { RestaurantBrowser } from '@/components/corporate/RestaurantBrowser';
import { PreOrderForm } from '@/components/corporate/PreOrderForm';
import { PreOrderManager } from '@/components/corporate/PreOrderManager';

const CorporateDashboard = () => {
  const { user, hasRole, loading } = useAuth();
  const navigate = useNavigate();
  const [corporateAccount, setCorporateAccount] = useState<any>(null);
  const [teamMemberCount, setTeamMemberCount] = useState(0);
  const [monthlySpend, setMonthlySpend] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [selectedRestaurantName, setSelectedRestaurantName] = useState<string>('');

  useEffect(() => {
    if (!loading && !hasRole('corporate_admin')) {
      toast.error('Access denied', {
        description: 'You need corporate admin access to view this page'
      });
      navigate('/');
    }
  }, [loading, hasRole, navigate]);

  useEffect(() => {
    if (user) {
      fetchCorporateData();
    }
  }, [user]);

  const fetchCorporateData = async () => {
    try {
      // Get corporate account
      const { data: accountData, error: accountError } = await supabase
        .from('corporate_accounts')
        .select('*')
        .eq('admin_id', user?.id)
        .single();

      if (accountError) throw accountError;
      setCorporateAccount(accountData);

      // Get team member count
      const { count: memberCount, error: memberError } = await supabase
        .from('corporate_team_members')
        .select('*', { count: 'exact', head: true })
        .eq('corporate_account_id', accountData.id)
        .eq('is_active', true);

      if (memberError) throw memberError;
      setTeamMemberCount(memberCount || 0);

      // Get active orders count
      const { count: orderCount, error: orderError } = await supabase
        .from('pre_orders')
        .select('*', { count: 'exact', head: true })
        .eq('corporate_account_id', accountData.id)
        .in('status', ['pending', 'confirmed']);

      if (orderError) throw orderError;
      setActiveOrders(orderCount || 0);

      // Calculate monthly spend (placeholder - would need actual calculation)
      setMonthlySpend(accountData.monthly_budget || 0);

    } catch (error: any) {
      console.error('Error fetching corporate data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  if (loading) {
    return (
      <PageContainer title="Corporate Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Corporate Dashboard">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif">Corporate Dashboard</h1>
            {corporateAccount && (
              <p className="text-muted-foreground mt-1">{corporateAccount.company_name}</p>
            )}
          </div>
          {!selectedRestaurantId && (
            <Button onClick={() => navigate('/scan')}>
              <Wine className="h-4 w-4 mr-2" />
              Scan Wine List
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMemberCount}</div>
              <p className="text-xs text-muted-foreground">Active users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlySpend}</div>
              <p className="text-xs text-muted-foreground">Available budget</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOrders}</div>
              <p className="text-xs text-muted-foreground">Pending & confirmed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription</CardTitle>
              <Wine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {corporateAccount?.subscription_tier || 'None'}
              </div>
              <p className="text-xs text-muted-foreground">
                ${corporateAccount?.monthly_fee || 0}/month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
                <CardDescription>Corporate account information and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Company</p>
                    <p className="text-lg">{corporateAccount?.company_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Industry</p>
                    <p className="text-lg">{corporateAccount?.industry || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Per Meal Budget</p>
                    <p className="text-lg">${corporateAccount?.per_meal_budget || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p className="text-lg">{corporateAccount?.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>Manage your corporate team members</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Team management coming soon. You'll be able to add, remove, and manage team member access.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            {selectedRestaurantId ? (
              <PreOrderForm
                restaurantId={selectedRestaurantId}
                restaurantName={selectedRestaurantName}
                onBack={() => {
                  setSelectedRestaurantId(null);
                  setSelectedRestaurantName('');
                  fetchCorporateData();
                }}
              />
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Pre-Order</CardTitle>
                    <CardDescription>Select a partner restaurant to begin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RestaurantBrowser
                      onSelectRestaurant={(id, name) => {
                        setSelectedRestaurantId(id);
                        setSelectedRestaurantName(name);
                      }}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View your past and pending wine pre-orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PreOrderManager />
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Configure your corporate account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Settings management coming soon. You'll be able to update budgets, preferences, and billing information.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default CorporateDashboard;
