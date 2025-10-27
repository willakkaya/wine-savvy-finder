import React, { useState, useEffect } from 'react';
import { Heart, Search, Trash2 } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import WineCardLink from '@/components/wine/WineCardLink';
import { WineInfo } from '@/components/wine/WineCard';
import { 
  getFavorites, 
  clearFavorites, 
  removeFavorite 
} from '@/utils/favoritesUtils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<WineInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const loadFavorites = async () => {
      setLoading(true);
      try {
        const loadedFavorites = await getFavorites();
        setFavorites(loadedFavorites);
      } catch (error) {
        console.error('Error loading favorites:', error);
        toast({
          title: "Error",
          description: "Failed to load favorites. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user, navigate, toast]);
  
  const handleRemoveFavorite = async (wineId: string) => {
    try {
      await removeFavorite(wineId);
      const updatedFavorites = await getFavorites();
      setFavorites(updatedFavorites);
      toast({
        title: "Removed from favorites",
        description: "Wine has been removed from your favorites",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove favorite. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleClearAllFavorites = async () => {
    try {
      await clearFavorites();
      setFavorites([]);
      toast({
        title: "Favorites cleared",
        description: "All wines have been removed from your favorites",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear favorites. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Filter wines based on search query
  const filteredFavorites = favorites.filter(wine => {
    const lowercaseQuery = searchQuery.toLowerCase();
    return (
      wine.name.toLowerCase().includes(lowercaseQuery) ||
      wine.winery.toLowerCase().includes(lowercaseQuery) ||
      wine.region.toLowerCase().includes(lowercaseQuery) ||
      wine.country.toLowerCase().includes(lowercaseQuery)
    );
  });

  if (loading) {
    return (
      <PageContainer title="My Favorites">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading your favorites...</p>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer title="My Favorites">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Your Favorite Wines
        </h1>
        
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="text-destructive border-destructive hover:bg-destructive/10 min-w-24 whitespace-nowrap"
                  disabled={favorites.length === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all favorites?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove all
                    wines from your favorites.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAllFavorites}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          {favorites.length === 0 ? (
            <div className="text-center p-12 bg-card rounded-lg border">
              <div className="flex flex-col items-center gap-4">
                <Heart size={48} className="text-muted-foreground opacity-30" />
                <div>
                  <p className="text-lg font-medium mb-2">
                    No favorites yet
                  </p>
                  <p className="text-muted-foreground mb-4">
                    You haven't added any wines to your favorites list.
                    Use the heart icon on any wine card to add it to your favorites.
                  </p>
                </div>
              </div>
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className="text-center p-8 bg-card rounded-lg border">
              <p className="text-lg font-medium mb-2">
                No matching wines found
              </p>
              <p className="text-muted-foreground">
                Try adjusting your search query.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((wine, index) => (
                <WineCardLink 
                  key={wine.id} 
                  wine={wine} 
                  rank={index + 1} 
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default FavoritesPage;
