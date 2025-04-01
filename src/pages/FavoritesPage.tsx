
import React, { useState, useEffect } from 'react';
import { Heart, Search, Trash2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<WineInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    // Load favorites from localStorage
    setFavorites(getFavorites());
  }, []);
  
  const handleRemoveFavorite = (wineId: string) => {
    removeFavorite(wineId);
    setFavorites(getFavorites());
    toast({
      title: "Removed from favorites",
      description: "Wine has been removed from your favorites",
    });
  };
  
  const handleClearAllFavorites = () => {
    clearFavorites();
    setFavorites([]);
    toast({
      title: "Favorites cleared",
      description: "All wines have been removed from your favorites",
    });
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif text-center text-wine-dark mb-4">
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
              <div className="text-center p-12 bg-white rounded-lg shadow-sm border">
                <div className="flex flex-col items-center gap-4">
                  <Heart size={48} className="text-wine opacity-30" />
                  <div>
                    <p className="text-lg font-medium text-wine-dark mb-2">
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
              <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
                <p className="text-lg font-medium text-wine-dark mb-2">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default FavoritesPage;
