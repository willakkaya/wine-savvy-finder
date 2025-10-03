
import React from 'react';
import { Wine, Star, DollarSign, Award, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ShareButton from './ShareButton';
import FavoritesButton from './FavoritesButton';
import FoodPairingBadge from './FoodPairingBadge';
import { getTopFoodPairings } from '@/utils/foodPairingUtils';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useIsMobile } from '@/hooks/use-mobile';

export interface WineInfo {
  id: string;
  name: string;
  winery: string;
  year: number;
  region: string;
  country: string;
  price: number;
  priceGlass?: number;
  priceBottle?: number;
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
  const { settings } = useAppSettings();
  const isMobile = useIsMobile();
  
  // Handle missing price data
  const hasPriceData = wine.price && wine.marketPrice;
  const savings = hasPriceData ? ((wine.marketPrice - wine.price) / wine.marketPrice * 100).toFixed(0) : null;
  
  const valueLabel = hasPriceData
    ? wine.valueScore > 80 ? 'Exceptional Value' :
      wine.valueScore > 60 ? 'Great Value' :
      wine.valueScore > 40 ? 'Good Value' : 'Fair Value'
    : wine.rating > 85 ? 'Highly Rated' :
      wine.rating > 75 ? 'Well Rated' : 'Good Rating';

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
  
  // Get food pairings if wine type is available
  const foodPairings = wine.wineType ? getTopFoodPairings(wine.wineType).slice(0, isMobile ? 2 : 3) : [];

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-lg relative wine-card", 
      rank === 1 ? "border-gold" : "",
      className
    )} style={style}>
      <div className="relative">
        {rank === 1 && (
          <div className="absolute top-0 right-0 bg-gold text-white px-2 py-0.5 md:px-3 md:py-1 rounded-bl-md font-semibold text-xs md:text-sm z-10 flex items-center gap-1">
            <Award size={isMobile ? 12 : 14} className="animate-pulse" />
            <span>Top Value</span>
          </div>
        )}
        <div className={`h-32 md:h-44 bg-gradient-to-b ${getWineTypeGradient()} flex items-center justify-center overflow-hidden`}>
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
            <Wine size={isMobile ? 40 : 60} className="text-wine opacity-30" />
          )}
        </div>
      </div>
      
      <CardHeader className="pb-1 md:pb-2 px-3 md:px-4 pt-3 md:pt-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base md:text-lg font-serif line-clamp-2">{wine.name}</CardTitle>
          <div className="flex gap-1 ml-2">
            <FavoritesButton wine={wine} className="mt-[-8px]" />
            <ShareButton wine={wine} className="mt-[-8px] mr-[-8px]" />
          </div>
        </div>
        <CardDescription className="line-clamp-1 text-xs md:text-sm">
          {wine.winery} • {wine.year}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 md:pb-3 px-3 md:px-4">
        <div className="flex flex-col gap-2 md:gap-3">
          <div className="flex flex-wrap gap-1 items-center">
            <Badge className="bg-wine text-white hover:bg-wine-dark text-xs">
              {valueLabel}
            </Badge>
            {settings.showSavings && !settings.discreetMode && hasPriceData && (
              <span className="text-xs md:text-sm text-wine-dark font-medium">Save {savings}%</span>
            )}
            {!hasPriceData && (
              <span className="text-xs text-muted-foreground">No price data available</span>
            )}
          </div>
          
          {/* Food Pairings */}
          {foodPairings.length > 0 && (
            <div className="flex flex-wrap gap-1 md:gap-1.5 mb-0.5 md:mb-1">
              {foodPairings.map((pairing, index) => (
                <FoodPairingBadge key={index} pairing={pairing} />
              ))}
            </div>
          )}
          
          {/* Price Information (conditional on settings) */}
          {(!settings.discreetMode && settings.showPrices && hasPriceData) && (
            <div className="space-y-1">
              {/* Show both glass and bottle prices if available */}
              {wine.priceGlass && wine.priceBottle && (
                <div className="grid grid-cols-2 gap-1 md:gap-2 text-xs md:text-sm">
                  <div className="flex items-center gap-1 bg-secondary/50 p-1.5 md:p-2 rounded-md dark:bg-secondary">
                    <DollarSign size={isMobile ? 12 : 14} className="text-wine" />
                    <span className="font-medium">${wine.priceGlass}</span>
                    <span className="text-[10px] md:text-xs text-muted-foreground ml-0.5 md:ml-1">glass</span>
                  </div>
                  <div className="flex items-center gap-1 bg-secondary/50 p-1.5 md:p-2 rounded-md dark:bg-secondary">
                    <DollarSign size={isMobile ? 12 : 14} className="text-wine" />
                    <span className="font-medium">${wine.priceBottle}</span>
                    <span className="text-[10px] md:text-xs text-muted-foreground ml-0.5 md:ml-1">bottle</span>
                  </div>
                </div>
              )}
              
              {/* Show only glass price if that's all we have */}
              {wine.priceGlass && !wine.priceBottle && (
                <div className="flex items-center gap-1 bg-secondary/50 p-1.5 md:p-2 rounded-md dark:bg-secondary">
                  <DollarSign size={isMobile ? 12 : 14} className="text-wine" />
                  <span className="font-medium">${wine.priceGlass}</span>
                  <span className="text-[10px] md:text-xs text-muted-foreground ml-0.5 md:ml-1">glass</span>
                </div>
              )}
              
              {/* Show only bottle price if that's all we have (or fallback to wine.price) */}
              {!wine.priceGlass && (wine.priceBottle || wine.price) && (
                <div className="flex items-center gap-1 bg-secondary/50 p-1.5 md:p-2 rounded-md dark:bg-secondary">
                  <DollarSign size={isMobile ? 12 : 14} className="text-wine" />
                  <span className="font-medium">${wine.priceBottle || wine.price}</span>
                  <span className="text-[10px] md:text-xs text-muted-foreground ml-0.5 md:ml-1">bottle</span>
                </div>
              )}
              
              {/* Market price comparison */}
              {wine.marketPrice && (
                <div className="flex items-center gap-1 bg-secondary/50 p-1.5 md:p-2 rounded-md dark:bg-secondary">
                  <DollarSign size={isMobile ? 12 : 14} className="text-wine" />
                  <span className="font-medium">${wine.marketPrice}</span>
                  <span className="text-[10px] md:text-xs text-muted-foreground ml-0.5 md:ml-1">retail</span>
                </div>
              )}
            </div>
          )}
          
          {/* Show market price only if available but no restaurant price */}
          {(!settings.discreetMode && settings.showPrices && !wine.price && wine.marketPrice) && (
            <div className="bg-secondary/50 p-1.5 md:p-2 rounded-md dark:bg-secondary text-center">
              <div className="flex items-center justify-center gap-1">
                <DollarSign size={isMobile ? 12 : 14} className="text-wine" />
                <span className="font-medium">${wine.marketPrice}</span>
                <span className="text-[10px] md:text-xs text-muted-foreground ml-0.5 md:ml-1">est. retail</span>
              </div>
            </div>
          )}
          
          {/* Discreet Mode Alternative */}
          {settings.discreetMode && (
            <div className="bg-secondary/50 p-1.5 md:p-2 rounded-md dark:bg-secondary text-center">
              <span className="text-xs md:text-sm font-medium">Price information hidden</span>
            </div>
          )}
          
          {/* Rating (conditional on settings) */}
          {(!settings.discreetMode && settings.showRatings) && (
            <div className="flex items-center gap-1 md:gap-2 bg-card p-1.5 md:p-2 rounded-md border border-border">
              <span className="text-xs md:text-sm font-medium">{wine.rating}/100</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={isMobile ? 12 : 14}
                    className={i < Math.round(wine.rating / 20) ? "text-gold fill-gold" : "text-muted-foreground"}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 text-[10px] md:text-xs text-muted-foreground px-3 md:px-4 pb-3 md:pb-4">
        <div className="w-full flex items-center justify-between">
          <span className="truncate max-w-[70%]">{wine.region}, {wine.country}</span>
          <Badge variant="outline" className="text-[10px] md:text-xs font-normal">
            #{rank}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WineCard;
