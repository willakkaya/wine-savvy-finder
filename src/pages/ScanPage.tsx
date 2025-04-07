
import React, { useState, useEffect } from 'react';
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

const ScanPage = () => {
  // Enhanced scan state management
  const [scanStage, setScanStage] = useState<'idle' | 'capturing' | 'processing' | 'analyzing' | 'complete'>('idle');
  const [scanMessage, setScanMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultsCount, setResultsCount] = useState(0);
  const isMobile = useIsMobile();
  const { settings } = useAppSettings();
  
  // Handle image capture complete
  const handleImageCapture = (imageData: string) => {
    if (!imageData) {
      toast.error('Failed to capture image', {
        description: 'Please try again'
      });
      return;
    }
    
    // Start processing the captured image
    setScanStage('processing');
    setScanMessage('Processing wine list image...');
    setIsProcessing(true);
    
    // Simulate processing steps (replace with actual processing)
    setTimeout(() => {
      setScanStage('analyzing');
      setScanMessage('Analyzing wines and matching with database...');
      
      setTimeout(() => {
        const foundWines = Math.floor(Math.random() * 4) + 5; // Simulate 5-8 wines found
        setResultsCount(foundWines);
        setScanStage('complete');
        setScanMessage(`Analysis complete! Found ${foundWines} wines on the list.`);
        setIsProcessing(false);
        
        toast.success('Wine list processed successfully', {
          description: `We found ${foundWines} wines on the list`
        });
      }, 2500);
    }, 2000);
  };
  
  // Handle retry
  const handleRetry = () => {
    setScanStage('idle');
    setScanMessage('');
    setIsProcessing(false);
  };
  
  // View scan results
  const handleViewResults = () => {
    toast.info('View results clicked', {
      description: 'This would navigate to results page in production'
    });
  };
  
  return (
    <PageContainer title="Scan Wine List" className="relative">
      <div className="flex flex-col items-center max-w-md mx-auto pb-6">
        <h1 className="text-2xl md:text-3xl font-serif mb-4 text-center">Scan Wine List</h1>
        <p className="text-muted-foreground text-center mb-6">
          Point your camera at a wine list to analyze prices and find the best values.
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
            </div>
          ) : (
            <ScanResultsPreview 
              resultsCount={resultsCount} 
              onViewResults={handleViewResults}
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
