import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import CameraCapture from '@/components/camera/CameraCapture';
import ScanProgress from '@/components/scan/ScanProgress';
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
  const isMobile = useIsMobile();
  const { settings } = useAppSettings();
  
  // Handle capture complete
  const handleCaptureComplete = (imageData: string | null) => {
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
        setScanStage('complete');
        setScanMessage('Analysis complete! Found 8 wines on the list.');
        setIsProcessing(false);
        
        toast.success('Wine list processed successfully', {
          description: 'We found 8 wines on the list'
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
  
  // Handle upload
  const handleUpload = () => {
    toast.info('Upload feature coming soon', {
      description: 'Photo upload will be available in the next update'
    });
  };
  
  return (
    <PageContainer title="Scan Wine List" className="relative">
      <div className="flex flex-col items-center max-w-md mx-auto">
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
                onCaptureComplete={handleCaptureComplete} 
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
            <div className="bg-wine/10 p-6 rounded-xl">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="text-wine h-10 w-10" />
              </div>
              <h3 className="text-xl font-medium text-center mb-2">Analysis Complete!</h3>
              <p className="text-center text-muted-foreground mb-4">
                We found 8 wines on the list and analyzed their value.
              </p>
              <Button className="w-full bg-wine hover:bg-wine-dark" size="lg">
                <Check className="mr-2 h-4 w-4" />
                View Results
              </Button>
            </div>
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
            onClick={handleUpload}
            variant="outline" 
            className="flex-1"
            disabled={isProcessing}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
        
        {/* Help text */}
        <p className="text-xs text-muted-foreground mt-6 text-center">
          For best results, ensure good lighting and hold your device steady.
          {isMobile ? " Tap to focus on the wine list." : ""}
        </p>
      </div>
    </PageContainer>
  );
};

export default ScanPage;
