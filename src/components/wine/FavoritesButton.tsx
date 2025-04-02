
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { WineInfo } from './WineCard';
import { toggleFavorite, isFavorite } from '@/utils/favoritesUtils';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface FavoritesButtonProps {
  wine: WineInfo;
  className?: string;
}

const FavoritesButton: React.FC<FavoritesButtonProps> = ({ wine, className }) => {
  const [isFavorited, setIsFavorited] = useState(isFavorite(wine.id));
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling to parent elements
    e.preventDefault(); // Prevent default behavior for links
    
    const newState = toggleFavorite(wine);
    setIsFavorited(newState);
    
    // Show toast
    toast({
      title: newState ? "Added to favorites" : "Removed from favorites",
      description: newState 
        ? `${wine.name} has been added to your favorites` 
        : `${wine.name} has been removed from your favorites`,
      duration: 3000,
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "rounded-full hover:bg-background/80 transition-colors touch-manipulation",
        isMobile ? "min-w-12 min-h-12" : "",
        isFavorited ? "text-rose-500" : "text-muted-foreground",
        className
      )}
      onClick={handleToggleFavorite}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        size={isMobile ? 20 : 22} 
        className={cn(
          "transition-all",
          isFavorited ? "fill-rose-500 scale-110" : "fill-none"
        )} 
      />
    </Button>
  );
};

export default FavoritesButton;
