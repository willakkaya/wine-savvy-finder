
import { toast } from 'sonner';
import { WineInfo } from '@/components/wine/WineCard';
import { processWineListImage } from '@/utils/ocrUtils';
import { handleNetworkError, handleTimeoutError, handleScanError } from '@/utils/scanErrorUtils';
import { ScanStage } from '@/types/scanTypes';

/**
 * Handles the image capture and processing workflow
 */
export const handleImageCapture = async (
  imageData: string,
  offlineAvailable: boolean,
  callbacks: {
    setIsProcessing: (value: boolean) => void;
    setScanStage: (stage: ScanStage) => void;
    setScanMessage: (message: string) => void;
    setFoundWines: (wines: WineInfo[]) => void;
    setNetworkError: (value: boolean) => void;
    setShowOfflineOptions: (value: boolean) => void;
  }
) => {
  const { 
    setIsProcessing, 
    setScanStage, 
    setScanMessage, 
    setFoundWines,
    setNetworkError,
    setShowOfflineOptions
  } = callbacks;

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
    let currentScanStage = 'processing';
    
    setTimeout(() => {
      if (currentScanStage === 'processing' || currentScanStage === 'analyzing') {
        setScanStage('analyzing');
        currentScanStage = 'analyzing';
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
    
    if (!navigator.onLine || error.message?.includes('Network connection')) {
      handleNetworkError(offlineAvailable, {
        setIsProcessing,
        setScanStage,
        setScanMessage,
        setNetworkError,
        setShowOfflineOptions
      });
    } else if (error.message?.includes('timeout')) {
      handleTimeoutError({
        setIsProcessing,
        setScanStage,
        setScanMessage
      });
    } else {
      handleScanError(error.message || "Failed to process the wine list", {
        setIsProcessing,
        setScanStage,
        setScanMessage
      });
    }
  } finally {
    setIsProcessing(false);
  }
};
