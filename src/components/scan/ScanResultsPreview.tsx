
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wine, DollarSign, Star, Sparkles } from 'lucide-react';
import { WineInfo } from '@/components/wine/WineCard';

interface ScanResultsPreviewProps {
  resultsCount: number;
  onViewResults: () => void;
  topValueWine?: WineInfo;
  highestRatedWine?: WineInfo;
}

const ScanResultsPreview: React.FC<ScanResultsPreviewProps> = ({ 
  resultsCount, 
  onViewResults,
  topValueWine,
  highestRatedWine
}) => {
  return (
    <Card className="w-full overflow-hidden cursor-pointer hover:shadow-md transition-all"
          onClick={onViewResults}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wine className="text-wine h-5 w-5" />
            <h3 className="font-medium">Scan Results</h3>
          </div>
          <Badge variant="outline">{resultsCount} wines</Badge>
        </div>
        
        <div className="space-y-3">
          {topValueWine && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Top Value</span>
                <div className="flex items-center gap-1 text-wine">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">
                    {topValueWine.name.substring(0, 20)}
                    {topValueWine.name.length > 20 ? '...' : ''}
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/40 p-1.5 rounded">
                {generateWineNote(topValueWine, 'value')}
              </div>
            </div>
          )}
          
          {highestRatedWine && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Highest Rated</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-gold fill-gold" />
                  <span className="font-medium">
                    {highestRatedWine.name.substring(0, 20)}
                    {highestRatedWine.name.length > 20 ? '...' : ''}
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/40 p-1.5 rounded">
                {generateWineNote(highestRatedWine, 'rating')}
              </div>
            </div>
          )}
          
          <div className="bg-wine/10 p-2 rounded-md text-xs text-center mt-2 text-wine-dark">
            <Sparkles className="h-3 w-3 inline mr-1" />
            Tap to view full analysis with tasting notes
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to generate a wine note based on the wine's characteristics
const generateWineNote = (wine: WineInfo, noteType: 'value' | 'rating'): string => {
  if (noteType === 'value') {
    const saving = wine.marketPrice - wine.price;
    const savingPercent = Math.round((saving / wine.marketPrice) * 100);
    return `Save $${saving} (${savingPercent}%) compared to retail. ${wine.year} ${wine.region} ${wine.winery.split(' ')[0]} wine with balanced flavors.`;
  } else {
    return `${wine.rating}/100 points. ${wine.region} ${wine.winery.split(' ')[0]} wine with excellent complexity and structure. ${wine.year} vintage.`;
  }
};

export default ScanResultsPreview;
