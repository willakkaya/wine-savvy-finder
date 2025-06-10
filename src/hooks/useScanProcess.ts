
import { useState, useEffect, useCallback } from 'react';
import { WineInfo } from '@/components/wine/WineCard';
import { ScanStage } from '@/types/scanTypes';
import { checkOfflineAvailability, getOfflineStatus } from '@/utils/scanOfflineUtils';
import { handleImageCapture } from '@/utils/scanProcessUtils';
import { simulateWineScan } from '@/utils/scanDemoUtils';

export const useScanProcess = (demoMode: boolean) => {
  const [scanStage, setScanStage] = useState<ScanStage>('idle');
  const [scanMessage, setScanMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [foundWines, setFoundWines] = useState<WineInfo[]>([]);
  const [networkError, setNetworkError] = useState<boolean>(false);
  const [offlineAvailable, setOfflineAvailable] = useState<boolean>(false);
  const [showOfflineOptions, setShowOfflineOptions] = useState<boolean>(false);
  
  // Memoized callbacks for better performance
  const callbacks = {
    setIsProcessing,
    setScanStage,
    setScanMessage,
    setFoundWines,
    setNetworkError,
    setShowOfflineOptions
  };
  
  // Network status handlers
  const handleOnline = useCallback(() => {
    setNetworkError(false);
    setShowOfflineOptions(false);
  }, []);
  
  const handleOffline = useCallback(() => {
    setNetworkError(true);
    const hasOfflineData = checkOfflineAvailability();
    setOfflineAvailable(hasOfflineData);
    setShowOfflineOptions(hasOfflineData);
  }, []);
  
  // Network status effect
  useEffect(() => {
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
  }, [handleOnline, handleOffline]);
  
  // Demo mode auto-simulation
  useEffect(() => {
    if (!demoMode || scanStage !== 'idle') return;
    
    const timer = setTimeout(() => {
      simulateWineScan(callbacks);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [scanStage, demoMode]);
  
  // Reset scan state
  const handleRetry = useCallback(() => {
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
  }, []);
  
  // Process image capture
  const processImageCapture = useCallback(async (imageData: string) => {
    await handleImageCapture(imageData, offlineAvailable, callbacks);
  }, [offlineAvailable]);

  // Process simulation
  const processSimulation = useCallback(async () => {
    await simulateWineScan(callbacks);
  }, []);

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
