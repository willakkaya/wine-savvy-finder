import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Search, Wine, DollarSign, Trash2, Edit } from 'lucide-react';

interface WineListItem {
  id: string;
  wine_id: string;
  current_price: number;
  by_glass_price: number | null;
  is_available: boolean;
  section: string | null;
  notes: string | null;
  wine_database: {
    name: string;
    winery: string;
    vintage: number;
    wine_type: string;
    region: string;
    image_url: string | null;
  };
}

interface WineSearchResult {
  id: string;
  name: string;
  winery: string;
  vintage: number;
  wine_type: string;
  region: string;
  country: string;
  market_price_estimate: number | null;
}

interface WineListManagerProps {
  restaurantId: string;
}

const WineListManager: React.FC<WineListManagerProps> = ({ restaurantId }) => {
  const [wineList, setWineList] = useState<WineListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WineSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedWine, setSelectedWine] = useState<WineSearchResult | null>(null);
  const [filterSection, setFilterSection] = useState<string>('all');
  
  const [addFormData, setAddFormData] = useState({
    bottlePrice: '',
    glassPrice: '',
    section: 'red',
    notes: ''
  });

  useEffect(() => {
    loadWineList();
  }, [restaurantId]);

  const loadWineList = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurant_wines')
        .select(`
          *,
          wine_database (
            name,
            winery,
            vintage,
            wine_type,
            region,
            image_url
          )
        `)
        .eq('restaurant_id', restaurantId)
        .order('section', { ascending: true });

      if (error) throw error;
      setWineList(data || []);
    } catch (error) {
      console.error('Error loading wine list:', error);
      toast.error('Failed to load wine list');
    }
  };

  const searchWines = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('wine_database')
        .select('*')
        .or(`name.ilike.%${query}%,winery.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching wines:', error);
      toast.error('Failed to search wines');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const debounceTimer = setTimeout(() => searchWines(value), 300);
    return () => clearTimeout(debounceTimer);
  };

  const selectWineToAdd = (wine: WineSearchResult) => {
    setSelectedWine(wine);
    setAddFormData({
      bottlePrice: wine.market_price_estimate ? (wine.market_price_estimate * 2.5).toFixed(0) : '',
      glassPrice: wine.market_price_estimate ? (wine.market_price_estimate * 0.5).toFixed(0) : '',
      section: wine.wine_type || 'red',
      notes: ''
    });
  };

  const handleAddWine = async () => {
    if (!selectedWine || !addFormData.bottlePrice) {
      toast.error('Please select a wine and set the bottle price');
      return;
    }

    try {
      const { error } = await supabase
        .from('restaurant_wines')
        .insert({
          restaurant_id: restaurantId,
          wine_id: selectedWine.id,
          current_price: parseFloat(addFormData.bottlePrice),
          by_glass_price: addFormData.glassPrice ? parseFloat(addFormData.glassPrice) : null,
          section: addFormData.section,
          notes: addFormData.notes || null,
          is_available: true
        });

      if (error) throw error;

      toast.success('Wine added to your list!');
      setShowAddDialog(false);
      setSelectedWine(null);
      setSearchQuery('');
      setSearchResults([]);
      loadWineList();
    } catch (error) {
      console.error('Error adding wine:', error);
      toast.error('Failed to add wine');
    }
  };

  const toggleAvailability = async (wineListId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('restaurant_wines')
        .update({ is_available: !currentStatus })
        .eq('id', wineListId);

      if (error) throw error;
      
      toast.success(currentStatus ? 'Wine marked as unavailable' : 'Wine marked as available');
      loadWineList();
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const removeWine = async (wineListId: string) => {
    if (!confirm('Are you sure you want to remove this wine from your list?')) return;

    try {
      const { error } = await supabase
        .from('restaurant_wines')
        .delete()
        .eq('id', wineListId);

      if (error) throw error;
      
      toast.success('Wine removed from your list');
      loadWineList();
    } catch (error) {
      console.error('Error removing wine:', error);
      toast.error('Failed to remove wine');
    }
  };

  const filteredWineList = filterSection === 'all' 
    ? wineList 
    : wineList.filter(item => item.section === filterSection);

  const wineTypeColors: Record<string, string> = {
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    white: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    sparkling: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    rose: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    dessert: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Wine List Management</h2>
          <p className="text-muted-foreground">Manage your restaurant's wine inventory and pricing</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-wine hover:bg-wine-dark">
              <Plus size={16} className="mr-2" />
              Add Wine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Wine to Your List</DialogTitle>
              <DialogDescription>Search for a wine in the database and set your pricing</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by wine name or winery..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>

              {isSearching && <p className="text-sm text-muted-foreground">Searching...</p>}

              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
                  {searchResults.map((wine) => (
                    <div
                      key={wine.id}
                      onClick={() => selectWineToAdd(wine)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedWine?.id === wine.id 
                          ? 'bg-wine/10 border-2 border-wine' 
                          : 'bg-muted hover:bg-muted/70'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{wine.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {wine.winery} • {wine.vintage} • {wine.region}
                          </p>
                        </div>
                        <Badge className={wineTypeColors[wine.wine_type] || ''}>
                          {wine.wine_type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedWine && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Set Pricing</CardTitle>
                    <CardDescription>
                      Market estimate: ${selectedWine.market_price_estimate || 'N/A'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bottlePrice">Bottle Price *</Label>
                        <Input
                          id="bottlePrice"
                          type="number"
                          step="0.01"
                          value={addFormData.bottlePrice}
                          onChange={(e) => setAddFormData({...addFormData, bottlePrice: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="glassPrice">Glass Price</Label>
                        <Input
                          id="glassPrice"
                          type="number"
                          step="0.01"
                          value={addFormData.glassPrice}
                          onChange={(e) => setAddFormData({...addFormData, glassPrice: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="section">Section</Label>
                      <Select
                        value={addFormData.section}
                        onValueChange={(value) => setAddFormData({...addFormData, section: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="red">Red Wines</SelectItem>
                          <SelectItem value="white">White Wines</SelectItem>
                          <SelectItem value="sparkling">Sparkling</SelectItem>
                          <SelectItem value="rose">Rosé</SelectItem>
                          <SelectItem value="dessert">Dessert Wines</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes (optional)</Label>
                      <Input
                        id="notes"
                        value={addFormData.notes}
                        onChange={(e) => setAddFormData({...addFormData, notes: e.target.value})}
                        placeholder="Tasting notes, food pairings, etc."
                      />
                    </div>
                    <Button onClick={handleAddWine} className="w-full bg-wine hover:bg-wine-dark">
                      Add to Wine List
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={filterSection === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterSection('all')}
          size="sm"
        >
          All Wines ({wineList.length})
        </Button>
        {['red', 'white', 'sparkling', 'rose', 'dessert'].map((section) => {
          const count = wineList.filter(w => w.section === section).length;
          return (
            <Button
              key={section}
              variant={filterSection === section ? 'default' : 'outline'}
              onClick={() => setFilterSection(section)}
              size="sm"
            >
              {section.charAt(0).toUpperCase() + section.slice(1)} ({count})
            </Button>
          );
        })}
      </div>

      {filteredWineList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Wine className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              {filterSection === 'all' 
                ? 'No wines in your list yet' 
                : `No ${filterSection} wines in your list`}
            </p>
            <Button onClick={() => setShowAddDialog(true)} variant="outline">
              <Plus size={16} className="mr-2" />
              Add Your First Wine
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWineList.map((item) => (
            <Card key={item.id} className={!item.is_available ? 'opacity-60' : ''}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-base leading-tight">
                      {item.wine_database.name}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {item.wine_database.winery} • {item.wine_database.vintage}
                    </CardDescription>
                  </div>
                  <Badge className={wineTypeColors[item.wine_database.wine_type] || ''} variant="outline">
                    {item.wine_database.wine_type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign size={14} className="text-wine" />
                  <span className="font-semibold">${item.current_price}</span>
                  <span className="text-muted-foreground">bottle</span>
                  {item.by_glass_price && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="font-semibold">${item.by_glass_price}</span>
                      <span className="text-muted-foreground">glass</span>
                    </>
                  )}
                </div>

                {item.notes && (
                  <p className="text-xs text-muted-foreground italic">{item.notes}</p>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.is_available}
                      onCheckedChange={() => toggleAvailability(item.id, item.is_available)}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWine(item.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WineListManager;
