
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAppSettings } from '@/hooks/useAppSettings';
import { 
  Eye, 
  EyeOff, 
  Star, 
  DollarSign, 
  Moon, 
  Sun,
  Percent,
  Trash2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { clearFavorites } from '@/utils/favoritesUtils';
import { clearWineCache } from '@/utils/wineUtils';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTheme } from 'next-themes';

const SettingsPage = () => {
  const { toast } = useToast();
  const { settings, updateSettings } = useAppSettings();
  const { theme, setTheme } = useTheme();
  
  // Clear all app data
  const handleClearData = () => {
    // Clear favorites
    clearFavorites();
    
    // Clear wine cache
    clearWineCache();
    
    // Show success notification
    toast({
      title: "Data cleared",
      description: "All saved wines and preferences have been removed",
    });
  };
  
  return (
    <PageContainer title="Settings">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl md:text-3xl font-serif mb-6 text-center">Settings</h1>
        
        {/* Display Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Display Options</CardTitle>
            <CardDescription>Customize how wine information is displayed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="discreet-mode">Discreet Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Hide prices when in public
                </p>
              </div>
              <Switch 
                id="discreet-mode" 
                checked={settings.discreetMode}
                onCheckedChange={(checked) => updateSettings({ discreetMode: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label htmlFor="show-ratings">Show Ratings</Label>
                  <Star className="h-4 w-4 text-gold" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Display critic ratings for wines
                </p>
              </div>
              <Switch 
                id="show-ratings" 
                checked={settings.showRatings}
                onCheckedChange={(checked) => updateSettings({ showRatings: checked })}
                disabled={settings.discreetMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label htmlFor="show-prices">Show Prices</Label>
                  <DollarSign className="h-4 w-4 text-wine" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Display restaurant and market prices
                </p>
              </div>
              <Switch 
                id="show-prices" 
                checked={settings.showPrices}
                onCheckedChange={(checked) => updateSettings({ showPrices: checked })}
                disabled={settings.discreetMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label htmlFor="show-savings">Show Savings</Label>
                  <Percent className="h-4 w-4 text-wine" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Display percentage savings vs. market price
                </p>
              </div>
              <Switch 
                id="show-savings" 
                checked={settings.showSavings}
                onCheckedChange={(checked) => updateSettings({ showSavings: checked })}
                disabled={settings.discreetMode}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label htmlFor="demo-mode">Demo Mode</Label>
                  <Sparkles className="h-4 w-4 text-gold" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enable demo mode with simulated scans
                </p>
              </div>
              <Switch 
                id="demo-mode" 
                checked={settings.demoMode}
                onCheckedChange={(checked) => updateSettings({ demoMode: checked })}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Appearance Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Adjust the visual theme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center py-8"
                onClick={() => setTheme('light')}
              >
                <Sun className="h-6 w-6 mb-2" />
                Light Mode
              </Button>
              
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center py-8"
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-6 w-6 mb-2" />
                Dark Mode
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Data Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage your saved data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full border-destructive text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your saved wines, favorites, and 
                    preferences. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={handleClearData}
                  >
                    Delete All Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                clearWineCache();
                toast({
                  title: "Cache cleared",
                  description: "Wine data cache has been refreshed"
                });
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Wine Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default SettingsPage;
