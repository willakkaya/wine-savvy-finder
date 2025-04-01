
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const { 
    settings, 
    toggleDiscreetMode, 
    toggleShowRatings, 
    toggleShowPrices, 
    toggleShowSavings,
    resetSettings 
  } = useAppSettings();
  
  const { toast } = useToast();

  const handleReset = () => {
    resetSettings();
    toast({
      title: "Settings reset",
      description: "All settings have been reset to their default values",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl mx-auto">
          <h1 className="text-3xl font-serif text-center text-wine-dark mb-8">
            App Settings
          </h1>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-medium mb-4 text-wine-dark">Display Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        {settings.discreetMode ? (
                          <EyeOff className="mr-2 h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                        )}
                        <div className="text-base font-medium">Discreet Mode</div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Hide detailed price information when showing your screen to others
                      </p>
                    </div>
                    <Switch 
                      checked={settings.discreetMode} 
                      onCheckedChange={toggleDiscreetMode} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-base font-medium">Show Ratings</div>
                      <p className="text-sm text-muted-foreground">
                        Display wine critic ratings on cards
                      </p>
                    </div>
                    <Switch 
                      checked={settings.showRatings} 
                      onCheckedChange={toggleShowRatings} 
                      disabled={settings.discreetMode}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-base font-medium">Show Prices</div>
                      <p className="text-sm text-muted-foreground">
                        Display wine prices on cards
                      </p>
                    </div>
                    <Switch 
                      checked={settings.showPrices} 
                      onCheckedChange={toggleShowPrices} 
                      disabled={settings.discreetMode}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-base font-medium">Show Savings</div>
                      <p className="text-sm text-muted-foreground">
                        Display savings percentage on cards
                      </p>
                    </div>
                    <Switch 
                      checked={settings.showSavings} 
                      onCheckedChange={toggleShowSavings} 
                      disabled={settings.discreetMode}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleReset} className="flex gap-2">
                  <RotateCcw size={16} />
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SettingsPage;
