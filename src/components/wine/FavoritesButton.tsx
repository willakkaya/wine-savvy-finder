import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { WineInfo } from './WineCard';
import { toggleFavorite, isFavorite } from '@/utils/favoritesUtils';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAnalytics } from '@/hooks/use-analytics';

interface FavoritesButtonProps {
  wine: WineInfo;
  className?: string;
}

const FavoritesButton: React.FC<FavoritesButtonProps> = ({ wine, className }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { logEvent, EventType } = useAnalytics();

  useEffect(() => {
    const checkFavorite = async () => {
      const favorited = await isFavorite(wine.id);
      setIsFavorited(favorited);
    };
    checkFavorite();
  }, [wine.id]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    try {
      const newState = await toggleFavorite(wine);
      setIsFavorited(newState);
      
      // Track analytics
      logEvent(
        newState ? EventType.WINE_FAVORITE : EventType.WINE_UNFAVORITE,
        { wine_id: wine.id, wine_name: wine.name }
      );
      
      // Show toast
      toast({
        title: newState ? "Added to favorites" : "Removed from favorites",
        description: newState 
          ? `${wine.name} has been added to your favorites` 
          : `${wine.name} has been removed from your favorites`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Please sign in to save favorites.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
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
      disabled={loading}
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
