import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import CameraCapture from '@/components/camera/CameraCapture';
import ScanProgress from '@/components/scan/ScanProgress';
import ScanTips from '@/components/scan/ScanTips';
import ScanResultsPreview from '@/components/scan/ScanResultsPreview';
import { Button } from '@/components/ui/button';
import { Camera, Upload, RefreshCw, Sparkles, Check, WifiOff, History } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppSettings } from '@/hooks/useAppSettings';
import { WineInfo } from '@/components/wine/WineCard';
import { processWineListImage } from '@/utils/ocrUtils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { getOfflineWines } from '@/utils/offlineUtils';

type ScanStage = 'idle' | 'capturing' | 'processing' | 'analyzing' | 'complete' | 'error';

const ScanPage = () => {
  const [scanStage, setScanStage] = useState<ScanStage>('idle');
  const [scanMessage, setScanMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [foundWines, setFoundWines] = useState<WineInfo[]>([]);
  const [networkError, setNetworkError] = useState<boolean>(false);
  const [offlineAvailable, setOfflineAvailable] = useState<boolean>(false);
  const [showOfflineOptions, setShowOfflineOptions] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const { settings } = useAppSettings();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleOnline = () => {
      setNetworkError(false);
      setShowOfflineOptions(false);
    };
    
    const handleOffline = () => {
      setNetworkError(true);
      checkOfflineAvailability();
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const isOffline = !navigator.onLine;
    setNetworkError(isOffline);
    
    if (isOffline) {
      checkOfflineAvailability();
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const checkOfflineAvailability = () => {
    const { wines } = getOfflineWines();
    const hasData = wines.length > 0;
    setOfflineAvailable(hasData);
    setShowOfflineOptions(hasData);
  };
  
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
  
  const simulateWineScan = () => {
    setIsProcessing(true);
    setScanStage('processing');
    setScanMessage('Processing wine list image...');
    
    setTimeout(() => {
      setScanStage('analyzing');
      setScanMessage('Analyzing wines and matching with database...');
      
      setTimeout(async () => {
        try {
          const response = await fetch('/api/demo-wines');
          const wines = await response.json();
          
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
        } catch (error) {
          handleScanError("Failed to process demo wines");
        }
      }, 2500);
    }, 2000);
  };
  
  const handleImageCapture = async (imageData: string) => {
    if (!imageData) {
      toast.error('Failed to capture image', {
        description: 'Please try again'
      });
      return;
    }
    
    if (!navigator.onLine) {
      setScanStage('error');
      setScanMessage('Network connection unavailable');
      setShowOfflineOptions(offlineAvailable);
      
      toast.error('Network connection unavailable', {
        description: offlineAvailable ? 
          'You can view your previously scanned wines in offline mode' :
          'Please check your internet connection and try again'
      });
      return;
    }
    
    setIsProcessing(true);
    setScanStage('processing');
    setScanMessage('Processing wine list image...');
    
    try {
      setTimeout(() => {
        if (scanStage === 'processing' || scanStage === 'analyzing') {
          setScanStage('analyzing');
          setScanMessage('Analyzing wines and matching with database...');
        }
      }, 1000);
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 60000);
      });
      
      const wines = await Promise.race([
        processWineListImage(imageData),
        timeoutPromise
      ]) as WineInfo[];
      
      setFoundWines(wines);
      setScanStage('complete');
      setScanMessage(`Analysis complete! Found ${wines.length} wines on the list.`);
      
      toast.success('Wine list processed successfully', {
        description: `We found ${wines.length} wines on the list`
      });
    } catch (error) {
      console.error('Error processing wine list image:', error);
      
      if (!navigator.onLine || error.message.includes('Network connection')) {
        handleNetworkError();
      } else if (error.message.includes('timeout')) {
        handleTimeoutError();
      } else {
        handleScanError(error.message || "Failed to process the wine list");
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleViewOfflineResults = () => {
    navigate('/results');
  };
  
  const handleNetworkError = () => {
    setIsProcessing(false);
    setScanStage('error');
    setScanMessage('Network connection unavailable');
    setNetworkError(true);
    setShowOfflineOptions(offlineAvailable);
    
    toast.error('Network connection unavailable', {
      description: offlineAvailable ? 
        'You can view your previously scanned wines in offline mode' :
        'Please check your internet connection and try again'
    });
  };
  
  const handleTimeoutError = () => {
    setIsProcessing(false);
    setScanStage('error');
    setScanMessage('Request timed out');
    
    toast.error('Request timed out', {
      description: 'The process took too long. Please try again with a clearer image'
    });
  };
  
  const handleScanError = (message: string) => {
    setIsProcessing(false);
    setScanStage('error');
    setScanMessage(message || 'Failed to process wine list');
    
    toast.error(message || 'Failed to process wine list', {
      description: 'Please try again with a clearer image'
    });
  };
  
  const handleRetry = () => {
    setScanStage('idle');
    setScanMessage('');
    setIsProcessing(false);
    setFoundWines([]);
    setNetworkError(false);
    setShowOfflineOptions(false);
    
    if (!navigator.onLine) {
      checkOfflineAvailability();
    }
  };
  
  const handleViewResults = () => {
    sessionStorage.setItem('scanResults', JSON.stringify(foundWines));
    navigate('/results');
    
    if (settings.demoMode) {
      toast.info('Demo Mode: Navigating to results', {
        description: 'In a real app, these would be actual wines from the scanned list'
      });
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
        
        {networkError && (
          <Alert variant="destructive" className="mb-4 animate-pulse">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>Network Unavailable</AlertTitle>
            <AlertDescription>
              {offlineAvailable ? 
                "You can view your previously scanned wines in offline mode." : 
                "Please check your internet connection and try again."}
            </AlertDescription>
          </Alert>
        )}
        
        {showOfflineOptions && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <History className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-700">Offline Mode Available</AlertTitle>
            <AlertDescription className="text-amber-700">
              <p className="mb-2">You can view your previously scanned wines while offline.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
                onClick={handleViewOfflineResults}
              >
                <History className="mr-2 h-4 w-4" />
                View Offline Results
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className={cn(
          "w-full overflow-hidden rounded-xl border border-border mb-4",
          isProcessing ? "bg-secondary/50" : "bg-card"
        )}>
          {scanStage !== 'complete' ? (
            <div className="relative">
              <CameraCapture 
                onImageCapture={handleImageCapture} 
                disabled={isProcessing || networkError}
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
              
              {settings.demoMode && scanStage === 'idle' && !networkError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    onClick={simulateWineScan} 
                    variant="wine" 
                    className="bg-wine/90 hover:bg-wine text-white"
                    disabled={networkError}
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Simulate Wine List Scan
                  </Button>
                </div>
              )}
              
              {networkError && !isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-white text-center p-4">
                    <WifiOff className="h-8 w-8 mb-2 mx-auto" />
                    <p className="text-lg font-semibold">Network Unavailable</p>
                    {offlineAvailable ? (
                      <div className="mt-4">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={handleViewOfflineResults}
                          className="bg-white/80 text-gray-900 hover:bg-white"
                        >
                          <History className="mr-2 h-4 w-4" />
                          View Offline Results
                        </Button>
                      </div>
                    ) : (
                      <p className="mt-2">Please check your connection and try again</p>
                    )}
                  </div>
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
        
        <div className="w-full mb-6">
          <ScanProgress 
            stage={scanStage} 
            message={scanMessage} 
          />
        </div>
        
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
          
          {scanStage === 'complete' ? (
            <Button 
              onClick={handleViewResults}
              variant="wine" 
              className="flex-1"
              disabled={isProcessing}
            >
              <Check className="mr-2 h-4 w-4" />
              View Results
            </Button>
          ) : networkError && offlineAvailable ? (
            <Button 
              onClick={handleViewOfflineResults}
              variant="outline"
              className="flex-1 border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
            >
              <History className="mr-2 h-4 w-4" />
              Offline Results
            </Button>
          ) : (
            <Button 
              onClick={handleViewResults}
              variant="outline" 
              className="flex-1"
              disabled={scanStage !== 'complete' || isProcessing}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Results
            </Button>
          )}
        </div>
        
        {!isProcessing && (
          <ScanTips />
        )}
      </div>
    </PageContainer>
  );
};

export default ScanPage;
