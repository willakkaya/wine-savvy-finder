
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CameraCapture from '@/components/camera/CameraCapture';
import WineCard, { WineInfo } from '@/components/wine/WineCard';

// Mock data for demonstration
const MOCK_WINES: WineInfo[] = [
  {
    id: '1',
    name: 'Château Margaux',
    winery: 'Château Margaux',
    year: 2015,
    region: 'Bordeaux',
    country: 'France',
    price: 120,
    marketPrice: 220,
    rating: 95,
    valueScore: 85,
  },
  {
    id: '2',
    name: 'Pinot Noir Reserve',
    winery: 'Belle Glos',
    year: 2018,
    region: 'Sonoma Coast',
    country: 'USA',
    price: 65,
    marketPrice: 90,
    rating: 92,
    valueScore: 72,
  },
  {
    id: '3',
    name: 'Barolo Classico',
    winery: 'Conterno',
    year: 2016,
    region: 'Piedmont',
    country: 'Italy',
    price: 85,
    marketPrice: 110,
    rating: 89,
    valueScore: 68,
  }
];

const ScanPage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<WineInfo[] | null>(null);
  const { toast } = useToast();

  const handleImageCapture = (capturedImage: string) => {
    setImage(capturedImage);
    setIsAnalyzing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setResults(MOCK_WINES);
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: "We've found the best value wines on this list!",
      });
    }, 3000);
  };

  const resetScan = () => {
    setImage(null);
    setResults(null);
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
                    Analyzing wine list and comparing with market prices...
                  </p>
                </div>
              </div>
            )}
            
            {results && (
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
                  <button 
                    onClick={resetScan}
                    className="text-wine hover:text-wine-dark underline"
                  >
                    Scan another wine list
                  </button>
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
