
import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WineCardLink from '@/components/wine/WineCardLink';
import { WineInfo } from '@/components/wine/WineCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { storeWineResults } from '@/utils/wineUtils';

const ResultsPage: React.FC = () => {
  const [wines, setWines] = useState<WineInfo[]>([]);
  const navigate = useNavigate();
  
  // Load results from sessionStorage on component mount
  useEffect(() => {
    const resultsData = sessionStorage.getItem('scanResults');
    
    if (resultsData) {
      try {
        const parsedResults = JSON.parse(resultsData);
        setWines(parsedResults);
        
        // Store wines in our cache for easy access from detail pages
        storeWineResults(parsedResults);
      } catch (error) {
        console.error('Error parsing scan results:', error);
        toast.error('Error loading scan results');
      }
    } else {
      // No results found, show a toast and then navigate back after a delay
      toast.error('No scan results found', {
        description: 'Please scan a wine list first'
      });
      setTimeout(() => navigate('/scan'), 2000);
    }
  }, [navigate]);
  
  // Sort wines by value score (highest first)
  const sortedWines = [...wines].sort((a, b) => b.valueScore - a.valueScore);
  
  return (
    <PageContainer title="Scan Results" className="pb-6">
      <div className="flex flex-col items-center max-w-4xl mx-auto">
        <div className="w-full flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/scan')}
            className="text-wine hover:bg-wine/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scanner
          </Button>
          
          <h1 className="text-xl md:text-2xl font-serif">Wine Analysis</h1>
          
          <div className="w-[88px]"> {/* Empty div for flex balance */}
          </div>
        </div>
        
        {wines.length > 0 ? (
          <>
            <Alert className="mb-6 bg-wine/5 border-wine/20">
              <Info className="h-4 w-4 text-wine" />
              <AlertTitle>Wine Analysis Results</AlertTitle>
              <AlertDescription>
                We found {wines.length} wines on the list. Wines are sorted by value (best deals first).
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {sortedWines.map((wine, index) => (
                <WineCardLink 
                  key={wine.id} 
                  wine={wine} 
                  rank={index + 1} 
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col items-center justify-center p-12 text-center">
            <Camera className="h-16 w-16 text-wine/30 mb-4" />
            <h2 className="text-xl font-serif mb-2">No wines found</h2>
            <p className="text-muted-foreground mb-6">
              Please scan a wine list to see results here
            </p>
            <Button onClick={() => navigate('/scan')} className="bg-wine hover:bg-wine-dark">
              Scan Wine List
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default ResultsPage;
