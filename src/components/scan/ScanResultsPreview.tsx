
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wine, DollarSign, Star } from 'lucide-react';
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
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Top Value</span>
            <div className="flex items-center gap-1 text-wine">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium">
                {topValueWine ? `${topValueWine.name.substring(0, 20)}${topValueWine.name.length > 20 ? '...' : ''}` : 'Best Malbec 2021'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Highest Rated</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-gold fill-gold" />
              <span className="font-medium">
                {highestRatedWine ? `${highestRatedWine.name.substring(0, 20)}${highestRatedWine.name.length > 20 ? '...' : ''}` : 'Premium Cabernet 2018'}
              </span>
            </div>
          </div>
          
          <div className="bg-muted/50 p-2 rounded-md text-xs text-center mt-2">
            Tap to view full analysis
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanResultsPreview;
