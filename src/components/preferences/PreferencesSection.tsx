
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import PreferencesDialog from './PreferencesDialog';

const PreferencesSection: React.FC = () => {
  const { preferences } = useUserPreferences();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wine Preferences</CardTitle>
        <CardDescription>
          Customize your wine preferences to get personalized recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium">Favorite Varietals</h4>
            <p className="text-sm text-muted-foreground">
              {preferences.favoriteVarietals.length > 0 
                ? preferences.favoriteVarietals.join(', ')
                : 'None selected'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Preferred Regions</h4>
            <p className="text-sm text-muted-foreground">
              {preferences.preferredRegions.length > 0 
                ? preferences.preferredRegions.join(', ')
                : 'None selected'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium">Price Range</h4>
            <p className="text-sm text-muted-foreground">
              ${preferences.priceRange.min} - ${preferences.priceRange.max}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Allergies</h4>
            <p className="text-sm text-muted-foreground">
              {preferences.allergies.length > 0 
                ? preferences.allergies.join(', ')
                : 'None specified'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div>
            <h4 className="text-sm font-medium">Sweetness</h4>
            <p className="text-sm text-muted-foreground">{preferences.tasteProfile.sweetness}/5</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Acidity</h4>
            <p className="text-sm text-muted-foreground">{preferences.tasteProfile.acidity}/5</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Tannin</h4>
            <p className="text-sm text-muted-foreground">{preferences.tasteProfile.tannin}/5</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Body</h4>
            <p className="text-sm text-muted-foreground">{preferences.tasteProfile.body}/5</p>
          </div>
        </div>
        
        <PreferencesDialog
          trigger={
            <Button className="w-full">
              Update Preferences
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
};

export default PreferencesSection;
