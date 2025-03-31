
import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Wine, Camera, FileQuestion } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CameraCapture from '@/components/camera/CameraCapture';
import WineCardLink from '@/components/wine/WineCardLink';
import { WineInfo } from '@/components/wine/WineCard';
import { processWineListImage } from '@/utils/ocrUtils';
import { storeWineResults } from '@/utils/wineUtils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";

const ScanPage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [results, setResults] = useState<WineInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for previously analyzed wines in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasResults = urlParams.get('hasResults');
    
    if (hasResults === 'true') {
      const savedResults = localStorage.getItem('wineResults');
      if (savedResults) {
        try {
          const parsedResults = JSON.parse(savedResults);
          if (Array.isArray(parsedResults) && parsedResults.length > 0) {
            setResults(parsedResults);
            // Clear the URL parameter without reloading
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (err) {
          console.error('Error parsing saved results:', err);
        }
      }
    }
  }, []);

  const handleImageCapture = async (capturedImage: string) => {
    setImage(capturedImage);
    setIsAnalyzing(true);
    setError(null);
    setAnalysisProgress(0);
    
    try {
      // Start progress animation
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          const increment = Math.random() * 10;
          const newProgress = Math.min(prev + increment, 95); // Cap at 95% until complete
          return newProgress;
        });
      }, 500);
      
      // Process the image using OCR and wine data extraction
      const wineResults = await processWineListImage(capturedImage);
      
      // Process complete - set to 100%
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // Take top results (or all if less than 5)
      const topResults = wineResults.slice(0, Math.min(wineResults.length, 5));
      
      // Store results for retrieval in details page
      storeWineResults(topResults);
      
      // Also save to localStorage for sharing/persistence
      localStorage.setItem('wineResults', JSON.stringify(topResults));
      
      setResults(topResults);
      
      if (topResults.length > 0) {
        toast({
          title: "Analysis Complete",
          description: `We've found ${topResults.length} wine values on this list!`,
        });
      } else {
        toast({
          title: "No Wines Found",
          description: "We couldn't identify any wines on this list. Try with a clearer image.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error analyzing wine list:", error);
      setError(error instanceof Error ? error.message : "Failed to analyze wine list");
      toast({
        title: "Analysis Failed",
        description: "We encountered an error while analyzing the wine list.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 500); // Small delay to ensure progress animation completes
    }
  };

  const resetScan = () => {
    setImage(null);
    setResults(null);
    setError(null);
    setAnalysisProgress(0);
  };

  const shareResults = async () => {
    if (!results || results.length === 0) return;
    
    try {
      // Create a shareable URL with a query parameter
      const shareUrl = `${window.location.origin}/scan?hasResults=true`;
      
      // Build share text
      const shareText = `Check out these ${results.length} great wine values I found with Wine Whisperer!`;
      
      // Use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: 'Wine Values Found',
          text: shareText,
          url: shareUrl
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast({
          title: "Link copied",
          description: "Share link copied to clipboard",
        });
      }
    } catch (err) {
      console.error('Error sharing results:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif text-center text-wine-dark mb-8">
            {!image ? 'Scan Wine List' : isAnalyzing ? 'Analyzing Wine List' : 'Best Wine Values'}
          </h1>
          
          <div className="w-full mb-8">
            {!image && !results && (
              <CameraCapture onImageCapture={handleImageCapture} />
            )}
            
            {image && isAnalyzing && (
              <div className="w-full flex flex-col items-center gap-8 p-8">
                <img src={image} alt="Captured wine list" className="w-full max-w-md rounded-lg border border-wine" />
                <div className="w-full max-w-md flex flex-col items-center gap-4">
                  <div className="w-full">
                    <Progress value={analysisProgress} className="h-2 w-full bg-gray-100" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 size={20} className="animate-spin text-wine" />
                    <p className="text-sm text-muted-foreground">
                      {analysisProgress < 30 ? 'Scanning text...' : 
                       analysisProgress < 60 ? 'Identifying wines...' : 
                       analysisProgress < 90 ? 'Checking market prices...' : 
                       'Calculating best values...'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {results && results.length > 0 && (
              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {results.map((wine, index) => (
                    <WineCardLink 
                      key={wine.id} 
                      wine={wine} 
                      rank={index + 1} 
                      className="animate-fadeIn"
                      style={{ animationDelay: `${index * 150}ms` }}
                    />
                  ))}
                </div>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Button 
                    onClick={shareResults}
                    className="bg-wine text-white hover:bg-wine-dark"
                  >
                    Share These Finds
                  </Button>
                  <Button 
                    onClick={resetScan}
                    variant="outline"
                    className="text-wine border-wine hover:bg-wine/10 hover:text-wine-dark"
                  >
                    Scan another wine list
                  </Button>
                </div>
              </div>
            )}
            
            {(results === null || results.length === 0) && !isAnalyzing && image && (
              <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
                <div className="flex flex-col items-center gap-4">
                  <Wine size={48} className="text-wine opacity-30" />
                  <div>
                    <p className="text-lg font-medium text-wine-dark mb-2">
                      No wines identified
                    </p>
                    <p className="text-muted-foreground mb-4">
                      We couldn't identify any wines on this list. Try with a clearer image or different angle.
                    </p>
                  </div>
                  <Button 
                    onClick={resetScan}
                    variant="outline"
                    className="text-wine border-wine hover:bg-wine/10 hover:text-wine-dark"
                  >
                    Try again
                  </Button>
                </div>
              </div>
            )}
            
            {results && results.length === 0 && !isAnalyzing && !image && (
              <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
                <div className="flex flex-col items-center gap-4">
                  <FileQuestion size={48} className="text-wine opacity-30" />
                  <div>
                    <p className="text-lg font-medium text-wine-dark mb-2">
                      Ready to scan a wine list?
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Take a clear photo of a restaurant wine list to find the best values.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setImage(null)}
                      className="bg-wine text-white hover:bg-wine-dark gap-2"
                    >
                      <Camera size={16} />
                      Scan Wine List
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ScanPage;
