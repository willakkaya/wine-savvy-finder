import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

export interface PriceRange {
  min: number;
  max: number;
}

interface PriceRangeSelectorProps {
  priceRange: PriceRange;
  onPriceRangeChange: (range: PriceRange) => void;
}

const PRICE_PRESETS = [
  { label: 'Budget Friendly', min: 0, max: 50 },
  { label: 'Moderate', min: 0, max: 100 },
  { label: 'Premium', min: 0, max: 200 },
  { label: 'Luxury', min: 0, max: 500 },
];

export const PriceRangeSelector = ({ priceRange, onPriceRangeChange }: PriceRangeSelectorProps) => {
  const handleSliderChange = (values: number[]) => {
    onPriceRangeChange({ min: values[0], max: values[1] });
  };

  const handlePresetClick = (preset: typeof PRICE_PRESETS[0]) => {
    onPriceRangeChange({ min: preset.min, max: preset.max });
  };

  return (
    <Card className="border-wine/20 bg-gradient-to-br from-wine/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <DollarSign size={18} className="text-wine" />
          <div>
            <CardTitle className="text-base font-serif">Budget Range</CardTitle>
            <CardDescription className="text-xs">
              Set your comfortable price range per bottle
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Display */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-sm font-medium">
            ${priceRange.min}
          </Badge>
          <span className="text-xs text-muted-foreground">to</span>
          <Badge variant="outline" className="text-sm font-medium">
            ${priceRange.max === 500 ? '500+' : priceRange.max}
          </Badge>
        </div>

        {/* Slider */}
        <div className="px-2 py-4">
          <Slider
            min={0}
            max={500}
            step={10}
            value={[priceRange.min, priceRange.max]}
            onValueChange={handleSliderChange}
            className="w-full"
          />
        </div>

        {/* Quick Presets */}
        <div className="grid grid-cols-2 gap-2">
          {PRICE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetClick(preset)}
              className={`text-xs py-2 px-3 rounded-md transition-all ${
                priceRange.min === preset.min && priceRange.max === preset.max
                  ? 'bg-wine text-white shadow-md'
                  : 'bg-background border border-wine/20 hover:bg-wine/10'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
