
import { toast } from 'sonner';

/**
 * Handles error when network is unavailable
 */
export const handleNetworkError = (
  offlineAvailable: boolean,
  callbacks: {
    setIsProcessing: (value: boolean) => void;
    setScanStage: (stage: 'error') => void;
    setScanMessage: (message: string) => void;
    setNetworkError: (value: boolean) => void;
    setShowOfflineOptions: (value: boolean) => void;
  }
) => {
  const { setIsProcessing, setScanStage, setScanMessage, setNetworkError, setShowOfflineOptions } = callbacks;
  
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

/**
 * Handles timeout errors during scan process
 */
export const handleTimeoutError = (
  callbacks: {
    setIsProcessing: (value: boolean) => void;
    setScanStage: (stage: 'error') => void;
    setScanMessage: (message: string) => void;
  }
) => {
  const { setIsProcessing, setScanStage, setScanMessage } = callbacks;
  
  setIsProcessing(false);
  setScanStage('error');
  setScanMessage('Request timed out');
  
  toast.error('Request timed out', {
    description: 'The process took too long. Please try again with a clearer image'
  });
};

/**
 * Handles general scan errors
 */
export const handleScanError = (
  message: string,
  callbacks: {
    setIsProcessing: (value: boolean) => void;
    setScanStage: (stage: 'error') => void;
    setScanMessage: (message: string) => void;
  }
) => {
  const { setIsProcessing, setScanStage, setScanMessage } = callbacks;
  
  setIsProcessing(false);
  setScanStage('error');
  setScanMessage(message || 'Failed to process wine list');
  
  toast.error(message || 'Failed to process wine list', {
    description: 'Please try again with a clearer image'
  });
};
