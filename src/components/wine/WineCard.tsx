
import React from 'react';
import { Wine, Star, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface WineInfo {
  id: string;
  name: string;
  winery: string;
  year: number;
  region: string;
  country: string;
  price: number;
  marketPrice: number;
  rating: number;
  valueScore: number;
  imageUrl?: string;
}

interface WineCardProps {
  wine: WineInfo;
  rank: number;
  className?: string;
}

const WineCard: React.FC<WineCardProps> = ({ wine, rank, className }) => {
  const savings = ((wine.marketPrice - wine.price) / wine.marketPrice * 100).toFixed(0);
  const valueLabel = 
    wine.valueScore > 80 ? 'Exceptional Value' :
    wine.valueScore > 60 ? 'Great Value' :
    wine.valueScore > 40 ? 'Good Value' : 'Fair Value';

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-lg", 
      rank === 1 ? "border-gold" : "", className)}>
      <div className="relative">
        {rank === 1 && (
          <div className="absolute top-0 right-0 bg-gold text-white px-3 py-1 rounded-bl-md font-semibold text-sm z-10">
            Top Value
          </div>
        )}
        <div className="h-32 bg-wine-light/20 flex items-center justify-center">
          {wine.imageUrl ? (
            <img 
              src={wine.imageUrl} 
              alt={wine.name} 
              className="h-full w-auto object-contain" 
            />
          ) : (
            <Wine size={60} className="text-wine opacity-30" />
          )}
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-serif">{wine.name}</CardTitle>
        </div>
        <CardDescription>
          {wine.winery} • {wine.year}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex flex-col gap-3">
          <div className="flex gap-1 items-center">
            <Badge className="bg-wine text-white hover:bg-wine-dark">
              {valueLabel}
            </Badge>
            <span className="text-sm text-wine-dark">Save {savings}%</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <DollarSign size={14} className="text-muted-foreground" />
              <span className="font-medium">${wine.price}</span>
              <span className="text-xs text-muted-foreground ml-1">menu</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign size={14} className="text-muted-foreground" />
              <span className="font-medium">${wine.marketPrice}</span>
              <span className="text-xs text-muted-foreground ml-1">retail</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{wine.rating}/100</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(wine.rating / 20) ? "text-gold fill-gold" : "text-muted-foreground"}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 text-xs text-muted-foreground">
        {wine.region}, {wine.country}
      </CardFooter>
    </Card>
  );
};

export default WineCard;
