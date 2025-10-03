import { Wine, Sparkles, Glasses, GlassWater } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type WineType = 'all' | 'red' | 'white' | 'sparkling' | 'rose' | 'dessert';

interface WinePreferencesProps {
  selectedType: WineType;
  onSelectType: (type: WineType) => void;
}

const wineTypes: { type: WineType; label: string; icon: any; gradient: string }[] = [
  { type: 'all', label: 'All Wines', icon: Wine, gradient: 'from-wine/10 to-wine/5' },
  { type: 'red', label: 'Red', icon: Wine, gradient: 'from-red-700/10 to-red-900/5' },
  { type: 'white', label: 'White', icon: Glasses, gradient: 'from-amber-100/10 to-amber-200/5' },
  { type: 'sparkling', label: 'Sparkling', icon: Sparkles, gradient: 'from-yellow-100/10 to-yellow-200/5' },
  { type: 'rose', label: 'Rosé', icon: GlassWater, gradient: 'from-pink-200/10 to-pink-300/5' },
  { type: 'dessert', label: 'Dessert', icon: Wine, gradient: 'from-amber-400/10 to-amber-500/5' },
];

export const WinePreferences = ({ selectedType, onSelectType }: WinePreferencesProps) => {
  return (
    <Card className="mb-6 border-wine/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-serif flex items-center gap-2">
          <Wine size={20} className="text-wine" />
          Wine Preferences
        </CardTitle>
        <CardDescription className="text-xs">
          Filter results to show only your preferred wine types
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {wineTypes.map(({ type, label, icon: Icon, gradient }) => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSelectType(type)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-2 ${
                selectedType === type 
                  ? 'bg-wine hover:bg-wine-dark text-white' 
                  : 'hover:bg-gradient-to-b ' + gradient
              }`}
            >
              <Icon size={16} />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          ))}
        </div>
        {selectedType !== 'all' && (
          <div className="mt-3 flex items-center justify-center">
            <Badge variant="secondary" className="text-xs">
              Filtering: {wineTypes.find(w => w.type === selectedType)?.label} wines only
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
