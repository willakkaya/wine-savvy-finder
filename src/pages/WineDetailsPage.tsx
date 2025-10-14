
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Share2, Star, DollarSign, Award, Wine, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { WineInfo } from '@/components/wine/WineCard';
import { getWineDetails } from '@/utils/wineUtils';
import { getFoodPairings } from '@/utils/foodPairingUtils';
import FavoritesButton from '@/components/wine/FavoritesButton';
import WineNotes from '@/components/wine/WineNotes';
import { useAnalytics, EventType } from '@/hooks/use-analytics';

const WineDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logEvent } = useAnalytics();

  const { data: wine, isLoading, error } = useQuery({
    queryKey: ['wine', id],
    queryFn: () => getWineDetails(id || ''),
    enabled: !!id,
  });

  // Track wine view
  useEffect(() => {
    if (wine) {
      logEvent(EventType.VIEW_WINE_DETAILS, {
        wine_id: wine.id,
        wine_name: wine.name,
        winery: wine.winery,
        value_score: wine.valueScore,
      });
    }
  }, [wine, logEvent]);

  const handleShare = async () => {
    if (!wine) return;
    
    const shareText = `Check out this wine I found! ${wine.name} (${wine.year}) from ${wine.winery} - Value Score: ${wine.valueScore}/100`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wine Whisperer - Great Wine Value',
          text: shareText,
          url: shareUrl,
        });
        logEvent(EventType.SHARE_WINE, {
          wine_id: wine.id,
          wine_name: wine.name,
        });
        toast({
          title: "Shared!",
          description: "Successfully shared this wine",
        });
      } catch (error) {
        console.error('Error sharing:', error);
        copyToClipboard(shareText + ' ' + shareUrl);
      }
    } else {
      copyToClipboard(shareText + ' ' + shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      logEvent(EventType.SHARE_WINE, {
        wine_id: wine?.id,
        wine_name: wine?.name,
        method: 'clipboard',
      });
      toast({
        title: "Copied to clipboard!",
        description: "Now you can paste it anywhere to share",
      });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Couldn't copy to clipboard",
        description: "Please try again or copy the URL manually",
        variant: "destructive",
      });
    });
  };

  const foodPairings = wine?.wineType ? getFoodPairings(wine.wineType) : [];
  const savingsAmount = wine ? Math.max(0, (wine.marketPrice || 0) - (wine.price || 0)) : 0;
  const savingsPercentage = wine && wine.marketPrice ? Math.round((savingsAmount / wine.marketPrice) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center px-4 py-8">
          <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="text-wine hover:text-wine-dark"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <Skeleton className="w-full h-72 md:w-1/3 rounded-lg" />
              <div className="w-full md:w-2/3">
                <Skeleton className="h-12 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-6 w-1/3 mb-6" />
                <Skeleton className="h-20 w-full mb-6" />
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Skeleton className="h-24 rounded-lg" />
                  <Skeleton className="h-24 rounded-lg" />
                  <Skeleton className="h-24 rounded-lg" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !wine) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center px-4 py-8">
          <div className="w-full max-w-4xl mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {error instanceof Error 
                  ? error.message 
                  : "Failed to load wine details. The wine might not exist or there was a problem retrieving the data."}
              </AlertDescription>
            </Alert>
            <div className="flex justify-center mt-8">
              <Button onClick={() => navigate(-1)}>
                <ArrowLeft size={16} className="mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            
            <div className="flex gap-2">
              <FavoritesButton wine={wine} />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShare}
              >
                <Share2 size={16} className="mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden border shadow-sm">
                {wine.imageUrl ? (
                  <img 
                    src={wine.imageUrl} 
                    alt={wine.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary">
                    <span className="text-muted-foreground">No image available</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="w-full md:w-2/3 space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">{wine.name}</h1>
                <p className="text-lg text-muted-foreground mb-1">{wine.winery}</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={16} />
                  <span>{wine.region}, {wine.country}</span>
                </div>
                
                {wine.wineType && (
                  <div className="flex gap-2 mt-3">
                    <Badge variant="secondary" className="text-sm">
                      <Wine size={14} className="mr-1" />
                      {wine.wineType}
                    </Badge>
                    {wine.year && <Badge variant="outline">{wine.year}</Badge>}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Value Score</CardTitle>
                      <Award size={18} className="text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-serif text-foreground">
                      {wine.valueScore}
                      <span className="text-sm text-muted-foreground ml-1">/100</span>
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Restaurant Price</CardTitle>
                      <DollarSign size={18} className="text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-serif text-foreground">${wine.price}</p>
                    {savingsAmount > 0 && (
                      <p className="text-xs text-green-600 mt-1">
                        Save ${savingsAmount} ({savingsPercentage}%)
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Critic Rating</CardTitle>
                      <Star size={18} className="text-amber-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-serif text-foreground">
                      {wine.rating}
                      <span className="text-sm text-muted-foreground ml-1">/100</span>
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {foodPairings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Food Pairings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {foodPairings.map((pairing, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {pairing.food}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <WineNotes wine={wine} />
              
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Value Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {savingsAmount > 0 ? (
                      <>
                        This wine offers excellent value, priced <strong>${savingsAmount}</strong> ({savingsPercentage}%) below the average market price of ${wine.marketPrice}. 
                      </>
                    ) : (
                      <>This wine is priced at market value. </>
                    )}
                    With a critic score of <strong>{wine.rating}/100</strong>, it represents a{' '}
                    <strong>
                      {wine.valueScore >= 80 ? 'exceptional' : 
                       wine.valueScore >= 60 ? 'very good' : 'good'}
                    </strong> value choice on this wine list.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WineDetailsPage;
