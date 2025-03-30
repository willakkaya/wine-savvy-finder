
import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CameraCapture from '@/components/camera/CameraCapture';
import WineCard, { WineInfo } from '@/components/wine/WineCard';
import { processWineListImage } from '@/utils/ocrUtils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';

const ScanPage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<WineInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageCapture = async (capturedImage: string) => {
    setImage(capturedImage);
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Process the image using OCR and wine data extraction
      const wineResults = await processWineListImage(capturedImage);
      
      // Take top results (or all if less than 3)
      const topResults = wineResults.slice(0, Math.min(wineResults.length, 3));
      
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
      setIsAnalyzing(false);
    }
  };

  const resetScan = () => {
    setImage(null);
    setResults(null);
    setError(null);
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
            {!image && (
              <CameraCapture onImageCapture={handleImageCapture} />
            )}
            
            {image && isAnalyzing && (
              <div className="w-full flex flex-col items-center gap-8 p-8">
                <img src={image} alt="Captured wine list" className="w-full max-w-md rounded-lg border border-wine" />
                <div className="flex flex-col items-center gap-4">
                  <Loader2 size={40} className="animate-spin text-wine" />
                  <p className="text-muted-foreground text-center">
                    Scanning wine list, extracting prices, and finding the best values...
                  </p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {results.map((wine, index) => (
                    <WineCard 
                      key={wine.id} 
                      wine={wine} 
                      rank={index + 1} 
                      className="animate-fadeIn"
                      style={{ animationDelay: `${index * 150}ms` }}
                    />
                  ))}
                </div>
                
                <div className="flex justify-center">
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
            
            {results && results.length === 0 && !isAnalyzing && (
              <div className="text-center p-8">
                <p className="text-lg text-muted-foreground mb-4">
                  We couldn't identify any wines on this list.
                </p>
                <Button 
                  onClick={resetScan}
                  variant="outline"
                  className="text-wine border-wine hover:bg-wine/10 hover:text-wine-dark"
                >
                  Try again with a clearer image
                </Button>
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
