
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import CameraCapture from '@/components/camera/CameraCapture';
import ScanProgress from '@/components/scan/ScanProgress';
import ScanTips from '@/components/scan/ScanTips';
import ScanResultsPreview from '@/components/scan/ScanResultsPreview';
import { Button } from '@/components/ui/button';
import { Camera, Upload, RefreshCw, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppSettings } from '@/hooks/useAppSettings';
import { searchWines } from '@/utils/wineApi';
import { WineInfo } from '@/components/wine/WineCard';

const ScanPage = () => {
  // Enhanced scan state management
  const [scanStage, setScanStage] = useState<'idle' | 'capturing' | 'processing' | 'analyzing' | 'complete'>('idle');
  const [scanMessage, setScanMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [foundWines, setFoundWines] = useState<WineInfo[]>([]);
  const isMobile = useIsMobile();
  const { settings } = useAppSettings();
  const navigate = useNavigate();
  
  // Demo mode - automatically simulate a scan after a delay for demonstration purposes
  useEffect(() => {
    if (settings.demoMode) {
      const timer = setTimeout(() => {
        if (scanStage === 'idle') {
          simulateWineScan();
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [scanStage, settings.demoMode]);
  
  // Simulate a wine scan process with dummy data
  const simulateWineScan = () => {
    setIsProcessing(true);
    setScanStage('processing');
    setScanMessage('Processing wine list image...');
    
    // First step - simulate image processing
    setTimeout(() => {
      setScanStage('analyzing');
      setScanMessage('Analyzing wines and matching with database...');
      
      // Second step - simulate wine matching
      setTimeout(() => {
        // Get wines from API (which returns our dummy data)
        searchWines().then(wines => {
          // Randomly select 6-9 wines to show diversity
          const randomCount = Math.floor(Math.random() * 4) + 6;
          const shuffled = [...wines].sort(() => 0.5 - Math.random());
          const selectedWines = shuffled.slice(0, randomCount);
          
          setFoundWines(selectedWines);
          setScanStage('complete');
          setScanMessage(`Analysis complete! Found ${selectedWines.length} wines on the list.`);
          setIsProcessing(false);
          
          toast.success('Wine list processed successfully', {
            description: `We found ${selectedWines.length} wines on the list`
          });
        });
      }, 2500);
    }, 2000);
  };
  
  // Handle image capture complete
  const handleImageCapture = (imageData: string) => {
    if (!imageData) {
      toast.error('Failed to capture image', {
        description: 'Please try again'
      });
      return;
    }
    
    // Simulate processing with our dummy data
    simulateWineScan();
  };
  
  // Handle retry
  const handleRetry = () => {
    setScanStage('idle');
    setScanMessage('');
    setIsProcessing(false);
    setFoundWines([]);
  };
  
  // View scan results - now actually navigates
  const handleViewResults = () => {
    // Store the found wines in sessionStorage for demo purposes
    sessionStorage.setItem('scanResults', JSON.stringify(foundWines));
    navigate('/results');
    
    // In demo mode, also show a toast explaining what's happening
    if (settings.demoMode) {
      toast.info('Demo Mode: Navigating to results', {
        description: 'In a real app, these would be actual wines from the scanned list'
      });
    }
  };
  
  // For demo purposes, we can add a button to trigger the scan
  const handleDemoScan = () => {
    if (!isProcessing) {
      simulateWineScan();
    }
  };
  
  return (
    <PageContainer title="Scan Wine List" className="relative">
      <div className="flex flex-col items-center max-w-md mx-auto pb-6">
        <h1 className="text-2xl md:text-3xl font-serif mb-4 text-center">Scan Wine List</h1>
        <p className="text-muted-foreground text-center mb-6">
          {settings.demoMode ? 
            "DEMO MODE: This will simulate scanning a wine list" : 
            "Point your camera at a wine list to analyze prices and find the best values."}
        </p>
        
        {/* Camera or Results Container */}
        <div className={cn(
          "w-full overflow-hidden rounded-xl border border-border mb-4",
          isProcessing ? "bg-secondary/50" : "bg-card"
        )}>
          {scanStage !== 'complete' ? (
            <div className="relative">
              <CameraCapture 
                onImageCapture={handleImageCapture} 
                disabled={isProcessing}
                className="aspect-[3/4] object-cover w-full"
              />
              
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-white text-center p-4">
                    <RefreshCw className="animate-spin h-8 w-8 mb-2 mx-auto" />
                    <p>{scanMessage}</p>
                  </div>
                </div>
              )}
              
              {/* Demo mode quick-scan button */}
              {settings.demoMode && scanStage === 'idle' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    onClick={handleDemoScan} 
                    variant="wine" 
                    className="bg-wine/90 hover:bg-wine text-white"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Simulate Wine List Scan
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <ScanResultsPreview 
              resultsCount={foundWines.length} 
              onViewResults={handleViewResults}
              topValueWine={foundWines.length > 0 ? foundWines[0] : undefined}
              highestRatedWine={foundWines.length > 1 ? foundWines[1] : undefined}
            />
          )}
        </div>
        
        {/* Progress Indicator */}
        <div className="w-full mb-6">
          <ScanProgress 
            stage={scanStage} 
            message={scanMessage} 
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 w-full">
          <Button 
            onClick={handleRetry}
            variant="outline" 
            className="flex-1"
            disabled={isProcessing}
          >
            <Camera className="mr-2 h-4 w-4" />
            {scanStage !== 'idle' ? 'Rescan' : 'Scan'}
          </Button>
          <Button 
            onClick={handleViewResults}
            variant={scanStage === 'complete' ? "wine" : "outline"} 
            className="flex-1"
            disabled={scanStage !== 'complete' || isProcessing}
          >
            {scanStage === 'complete' ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                View Results
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Results
              </>
            )}
          </Button>
        </div>
        
        {/* Show tips when not processing */}
        {!isProcessing && (
          <ScanTips />
        )}
      </div>
    </PageContainer>
  );
};

export default ScanPage;
