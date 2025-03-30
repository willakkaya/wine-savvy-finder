
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Share2, ExternalLink, Star, DollarSign, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { WineInfo } from '@/components/wine/WineCard';
import { getWineDetails } from '@/utils/wineUtils';

const WineDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: wine, isLoading, error } = useQuery({
    queryKey: ['wine', id],
    queryFn: () => getWineDetails(id || ''),
    enabled: !!id,
  });

  const handleShare = async () => {
    if (!wine) return;
    
    // Create share text
    const shareText = `Check out this wine I found with Wine Whisperer! ${wine.name} (${wine.year}) - Value Score: ${wine.valueScore}/100`;
    const shareUrl = window.location.href;
    
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wine Whisperer - Great Wine Value',
          text: shareText,
          url: shareUrl,
        });
        toast({
          title: "Shared!",
          description: "Successfully shared this wine",
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to clipboard if sharing failed
        copyToClipboard(shareText + ' ' + shareUrl);
      }
    } else {
      // Fallback for browsers that don't support sharing
      copyToClipboard(shareText + ' ' + shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
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
              className="text-wine hover:text-wine-dark"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to results
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleShare}
              className="text-wine border-wine hover:bg-wine/10"
            >
              <Share2 size={16} className="mr-2" />
              Share
            </Button>
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
            
            <div className="w-full md:w-2/3">
              <h1 className="text-3xl font-serif text-wine-dark mb-2">{wine.name}</h1>
              <p className="text-lg text-muted-foreground mb-1">{wine.winery}, {wine.year}</p>
              <p className="text-muted-foreground mb-6">{wine.region}, {wine.country}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-card rounded-lg p-4 border shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Value Score</span>
                    <Award size={18} className="text-wine" />
                  </div>
                  <p className="text-2xl font-serif text-wine-dark">{wine.valueScore}<span className="text-sm text-muted-foreground">/100</span></p>
                </div>
                
                <div className="bg-card rounded-lg p-4 border shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Restaurant Price</span>
                    <DollarSign size={18} className="text-wine" />
                  </div>
                  <p className="text-2xl font-serif text-wine-dark">${wine.price}</p>
                </div>
                
                <div className="bg-card rounded-lg p-4 border shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Market Price</span>
                    <DollarSign size={18} className="text-wine" />
                  </div>
                  <p className="text-2xl font-serif text-wine-dark">${wine.marketPrice}</p>
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-6 border shadow-sm mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="text-amber-500" size={20} />
                  <span className="text-lg font-serif">Critic's Rating: {wine.rating}/100</span>
                </div>
                <p className="text-muted-foreground">
                  This wine offers excellent value, priced ${wine.marketPrice - wine.price} below the average market price. 
                  With a critic score of {wine.rating}/100, it represents a {wine.valueScore > 80 ? "exceptional" : 
                  wine.valueScore > 60 ? "very good" : "good"} value on this wine list.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WineDetailsPage;
