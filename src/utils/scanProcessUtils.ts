
import { toast } from 'sonner';
import { WineInfo } from '@/components/wine/WineCard';
import { supabase } from '@/integrations/supabase/client';
import { handleNetworkError, handleTimeoutError, handleScanError } from '@/utils/scanErrorUtils';
import { ScanStage } from '@/types/scanTypes';

interface ScanCallbacks {
  setIsProcessing: (value: boolean) => void;
  setScanStage: (stage: ScanStage) => void;
  setScanMessage: (message: string) => void;
  setFoundWines: (wines: WineInfo[]) => void;
  setNetworkError: (value: boolean) => void;
  setShowOfflineOptions: (value: boolean) => void;
}

const TIMEOUT_DURATION = 60000; // 60 seconds
const ANALYZING_DELAY = 1000; // 1 second

/**
 * Validates image data and network connectivity
 */
const validateScanPrerequisites = (imageData: string, offlineAvailable: boolean, callbacks: ScanCallbacks): boolean => {
  if (!imageData) {
    toast.error('Failed to capture image', { description: 'Please try again' });
    return false;
  }
  
  if (!navigator.onLine) {
    callbacks.setScanStage('error');
    callbacks.setScanMessage('Network connection unavailable');
    callbacks.setShowOfflineOptions(offlineAvailable);
    
    toast.error('Network connection unavailable', {
      description: offlineAvailable ? 
        'You can view your previously scanned wines in offline mode' :
        'Please check your internet connection and try again'
    });
    return false;
  }
  
  return true;
};

/**
 * Sets up the analyzing stage transition
 */
const setupAnalyzingTransition = (callbacks: ScanCallbacks): (() => void) => {
  let currentStage = 'processing';
  
  const timeout = setTimeout(() => {
    if (currentStage === 'processing' || currentStage === 'analyzing') {
      callbacks.setScanStage('analyzing');
      currentStage = 'analyzing';
      callbacks.setScanMessage('Analyzing wines and matching with database...');
    }
  }, ANALYZING_DELAY);
  
  return () => clearTimeout(timeout);
};

/**
 * Processes the wine image with timeout handling using AI
 */
const processImageWithTimeout = async (imageData: string): Promise<WineInfo[]> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_DURATION);
  });
  
  const scanPromise = async (): Promise<WineInfo[]> => {
    const { data, error } = await supabase.functions.invoke('analyze-wine-list', {
      body: { image: imageData }
    });
    
    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Failed to analyze wine list');
    }
    
    if (data?.error) {
      throw new Error(data.error);
    }
    
    const wines: WineInfo[] = data?.wines || [];
    
    if (wines.length === 0) {
      throw new Error('No wines found on the list. Try taking a clearer photo.');
    }
    
    return wines;
  };
  
  return Promise.race([
    scanPromise(),
    timeoutPromise
  ]);
};

/**
 * Handles successful scan completion
 */
const handleScanSuccess = (wines: WineInfo[], callbacks: ScanCallbacks): void => {
  callbacks.setFoundWines(wines);
  callbacks.setScanStage('complete');
  callbacks.setScanMessage(`Analysis complete! Found ${wines.length} wines on the list.`);
  
  toast.success('Wine list processed successfully', {
    description: `We found ${wines.length} wines on the list`
  });
};

/**
 * Handles scan errors with appropriate error handling
 */
const handleScanFailure = (error: any, offlineAvailable: boolean, callbacks: ScanCallbacks): void => {
  console.error('Error processing wine list image:', error);
  
  if (!navigator.onLine || error.message?.includes('Network connection')) {
    handleNetworkError(offlineAvailable, callbacks);
  } else if (error.message?.includes('timeout')) {
    handleTimeoutError(callbacks);
  } else {
    handleScanError(error.message || "Failed to process the wine list", callbacks);
  }
};

/**
 * Handles the image capture and processing workflow
 */
export const handleImageCapture = async (
  imageData: string,
  offlineAvailable: boolean,
  callbacks: ScanCallbacks
): Promise<void> => {
  // Validate prerequisites
  if (!validateScanPrerequisites(imageData, offlineAvailable, callbacks)) {
    return;
  }
  
  // Initialize processing state
  callbacks.setIsProcessing(true);
  callbacks.setScanStage('processing');
  callbacks.setScanMessage('Processing wine list image...');
  
  // Setup analyzing transition
  const cleanupTransition = setupAnalyzingTransition(callbacks);
  
  try {
    // Process the image
    const wines = await processImageWithTimeout(imageData);
    
    // Handle success
    handleScanSuccess(wines, callbacks);
  } catch (error) {
    // Handle failure
    handleScanFailure(error, offlineAvailable, callbacks);
  } finally {
    // Cleanup
    cleanupTransition();
    callbacks.setIsProcessing(false);
  }
};
