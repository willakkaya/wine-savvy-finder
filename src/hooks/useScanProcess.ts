import { useState, useEffect } from 'react';
import { WineInfo } from '@/components/wine/WineCard';
import { ScanStage } from '@/types/scanTypes';
import { checkOfflineAvailability, getOfflineStatus } from '@/utils/scanOfflineUtils';
import { handleImageCapture } from '@/utils/scanProcessUtils';
import { simulateWineScan } from '@/utils/scanDemoUtils';

export type { ScanStage };

export const useScanProcess = (demoMode: boolean) => {
  const [scanStage, setScanStage] = useState<ScanStage>('idle');
  const [scanMessage, setScanMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [foundWines, setFoundWines] = useState<WineInfo[]>([]);
  const [networkError, setNetworkError] = useState<boolean>(false);
  const [offlineAvailable, setOfflineAvailable] = useState<boolean>(false);
  const [showOfflineOptions, setShowOfflineOptions] = useState<boolean>(false);
  
  useEffect(() => {
    const handleOnline = () => {
      setNetworkError(false);
      setShowOfflineOptions(false);
    };
    
    const handleOffline = () => {
      setNetworkError(true);
      const hasOfflineData = checkOfflineAvailability();
      setOfflineAvailable(hasOfflineData);
      setShowOfflineOptions(hasOfflineData);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial network status
    const { networkError: isOffline, offlineAvailable: hasData } = getOfflineStatus();
    setNetworkError(isOffline);
    setOfflineAvailable(hasData);
    setShowOfflineOptions(isOffline && hasData);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  useEffect(() => {
    if (demoMode) {
      const timer = setTimeout(() => {
        if (scanStage === 'idle') {
          simulateWineScan({
            setIsProcessing,
            setScanStage,
            setScanMessage,
            setFoundWines
          });
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [scanStage, demoMode]);
  
  const handleRetry = () => {
    setScanStage('idle');
    setScanMessage('');
    setIsProcessing(false);
    setFoundWines([]);
    setNetworkError(false);
    setShowOfflineOptions(false);
    
    if (!navigator.onLine) {
      const hasOfflineData = checkOfflineAvailability();
      setOfflineAvailable(hasOfflineData);
      setShowOfflineOptions(hasOfflineData);
    }
  };
  
  // Wrapped image capture handler
  const processImageCapture = async (imageData: string) => {
    await handleImageCapture(imageData, offlineAvailable, {
      setIsProcessing,
      setScanStage,
      setScanMessage,
      setFoundWines,
      setNetworkError,
      setShowOfflineOptions
    });
  };

  // Wrapped simulation handler
  const processSimulation = async () => {
    await simulateWineScan({
      setIsProcessing,
      setScanStage,
      setScanMessage,
      setFoundWines
    });
  };

  return {
    scanStage,
    scanMessage,
    isProcessing,
    foundWines,
    networkError,
    offlineAvailable,
    showOfflineOptions,
    handleImageCapture: processImageCapture,
    simulateWineScan: processSimulation,
    handleRetry,
    setShowOfflineOptions
  };
};
