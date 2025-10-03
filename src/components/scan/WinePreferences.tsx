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
    <Card className="border-wine/20 bg-gradient-to-br from-wine/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Wine size={18} className="text-wine" />
          <div>
            <CardTitle className="text-base font-serif">What would you like to drink?</CardTitle>
            <CardDescription className="text-xs">
              Filter to show only your preferred wines
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {wineTypes.map(({ type, label, icon: IconComponent, gradient }) => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSelectType(type)}
              className={`flex flex-col items-center gap-1.5 h-auto py-3 transition-all ${
                selectedType === type 
                  ? 'bg-wine hover:bg-wine-dark text-white shadow-md' 
                  : 'hover:bg-gradient-to-b hover:scale-105 ' + gradient
              }`}
            >
              <IconComponent size={18} />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          ))}
        </div>
        {selectedType !== 'all' && (
          <div className="mt-3 text-center">
            <Badge variant="secondary" className="text-xs">
              Showing only {wineTypes.find(w => w.type === selectedType)?.label} wines
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
