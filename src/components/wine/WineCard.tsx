
import React from 'react';
import { Wine, Star, DollarSign, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ShareButton from './ShareButton';

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
  wineType?: 'red' | 'white' | 'sparkling' | 'rose' | 'dessert';
}

interface WineCardProps {
  wine: WineInfo;
  rank: number;
  className?: string;
  style?: React.CSSProperties;
}

const WineCard: React.FC<WineCardProps> = ({ wine, rank, className, style }) => {
  const savings = ((wine.marketPrice - wine.price) / wine.marketPrice * 100).toFixed(0);
  const valueLabel = 
    wine.valueScore > 80 ? 'Exceptional Value' :
    wine.valueScore > 60 ? 'Great Value' :
    wine.valueScore > 40 ? 'Good Value' : 'Fair Value';

  // Get appropriate wine type based background gradient
  const getWineTypeGradient = () => {
    switch(wine.wineType) {
      case 'red':
        return 'from-red-700/5 to-red-900/10';
      case 'white':
        return 'from-amber-50/5 to-amber-100/10';
      case 'sparkling':
        return 'from-yellow-50/5 to-yellow-100/10';
      case 'rose':
        return 'from-pink-200/5 to-pink-300/10';
      case 'dessert':
        return 'from-amber-300/5 to-amber-400/10';
      default:
        return 'from-wine/5 to-wine/10';
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-lg relative wine-card", 
      rank === 1 ? "border-gold" : "",
      className
    )} style={style}>
      <div className="relative">
        {rank === 1 && (
          <div className="absolute top-0 right-0 bg-gold text-white px-3 py-1 rounded-bl-md font-semibold text-sm z-10 flex items-center gap-1">
            <Award size={14} className="animate-pulse" />
            <span>Top Value</span>
          </div>
        )}
        <div className={`h-44 bg-gradient-to-b ${getWineTypeGradient()} flex items-center justify-center overflow-hidden`}>
          {wine.imageUrl ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 backdrop-blur-[1px] bg-black/5"></div>
              <img 
                src={wine.imageUrl} 
                alt={wine.name} 
                className="h-auto max-h-full w-auto max-w-[70%] object-contain z-10 transition-transform hover:scale-105 drop-shadow-sm" 
              />
            </div>
          ) : (
            <Wine size={60} className="text-wine opacity-30" />
          )}
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-serif line-clamp-2">{wine.name}</CardTitle>
          <ShareButton wine={wine} className="mt-[-8px] mr-[-8px]" />
        </div>
        <CardDescription className="line-clamp-1">
          {wine.winery} • {wine.year}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex flex-col gap-3">
          <div className="flex gap-1 items-center">
            <Badge className="bg-wine text-white hover:bg-wine-dark">
              {valueLabel}
            </Badge>
            <span className="text-sm text-wine-dark font-medium">Save {savings}%</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1 bg-secondary/50 p-2 rounded-md dark:bg-secondary">
              <DollarSign size={14} className="text-wine" />
              <span className="font-medium">${wine.price}</span>
              <span className="text-xs text-muted-foreground ml-1">menu</span>
            </div>
            <div className="flex items-center gap-1 bg-secondary/50 p-2 rounded-md dark:bg-secondary">
              <DollarSign size={14} className="text-wine" />
              <span className="font-medium">${wine.marketPrice}</span>
              <span className="text-xs text-muted-foreground ml-1">retail</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-card p-2 rounded-md border border-border">
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
        <div className="w-full flex items-center justify-between">
          <span>{wine.region}, {wine.country}</span>
          <Badge variant="outline" className="text-xs font-normal">
            #{rank}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WineCard;
