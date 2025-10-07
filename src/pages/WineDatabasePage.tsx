import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, Wine, MapPin } from 'lucide-react';

interface WineEntry {
  id: string;
  name: string;
  winery: string;
  vintage: number;
  region: string;
  country: string;
  wine_type: string;
  grape_varieties: string[];
  market_price_estimate: number;
  critic_score: number;
  description: string;
}

const WineDatabasePage = () => {
  const [wines, setWines] = useState<WineEntry[]>([]);
  const [filteredWines, setFilteredWines] = useState<WineEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWines();
  }, []);

  useEffect(() => {
    filterWines();
  }, [wines, searchTerm, typeFilter]);

  const fetchWines = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wine_database')
        .select('*')
        .order('winery', { ascending: true });

      if (error) throw error;
      setWines(data || []);
    } catch (error: any) {
      console.error('Error fetching wines:', error);
      toast.error('Failed to load wine database');
    } finally {
      setLoading(false);
    }
  };

  const filterWines = () => {
    let filtered = [...wines];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(wine => 
        wine.name.toLowerCase().includes(search) ||
        wine.winery.toLowerCase().includes(search) ||
        wine.region.toLowerCase().includes(search) ||
        wine.grape_varieties?.some(g => g.toLowerCase().includes(search))
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(wine => wine.wine_type === typeFilter);
    }

    setFilteredWines(filtered);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      white: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      rose: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      sparkling: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      dessert: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <PageContainer title="Wine Database">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading wine database...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Wine Database">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-serif mb-2">Wine Database</h1>
          <p className="text-muted-foreground">
            Browse our curated collection of {wines.length} premium wines
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search wines, wineries, regions, or grapes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="rose">Rosé</SelectItem>
              <SelectItem value="sparkling">Sparkling</SelectItem>
              <SelectItem value="dessert">Dessert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredWines.length} of {wines.length} wines
        </p>

        {/* Wine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWines.map((wine) => (
            <Card key={wine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{wine.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {wine.winery} • {wine.vintage}
                    </CardDescription>
                  </div>
                  <Badge className={getTypeColor(wine.wine_type)}>
                    {wine.wine_type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{wine.region}, {wine.country}</span>
                </div>

                {wine.grape_varieties && wine.grape_varieties.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {wine.grape_varieties.map((grape, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {grape}
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {wine.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Market Price:</span>
                    <span className="ml-2 font-semibold text-lg">
                      ${wine.market_price_estimate}
                    </span>
                  </div>
                  {wine.critic_score && (
                    <div className="flex items-center gap-1">
                      <Wine className="h-4 w-4 text-wine" />
                      <span className="font-semibold">{wine.critic_score}</span>
                      <span className="text-xs text-muted-foreground">/100</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredWines.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Wine className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No wines found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};

export default WineDatabasePage;
