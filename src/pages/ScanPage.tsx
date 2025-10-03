
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import ScanTips from '@/components/scan/ScanTips';
import ScanContainer from '@/components/scan/ScanContainer';
import ScanStatusSection from '@/components/scan/ScanStatusSection';
import { WinePreferences, WineType } from '@/components/scan/WinePreferences';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useScanProcess } from '@/hooks/useScanProcess';
import { toast } from 'sonner';

const ScanPage = () => {
  const { settings } = useAppSettings();
  const navigate = useNavigate();
  const [winePreference, setWinePreference] = useState<WineType>('all');
  
  const {
    scanStage,
    scanMessage,
    isProcessing,
    foundWines,
    networkError,
    offlineAvailable,
    showOfflineOptions,
    handleImageCapture,
    simulateWineScan,
    handleRetry,
  } = useScanProcess(settings.demoMode);
  
  const handleViewOfflineResults = () => {
    navigate('/results');
  };
  
  const handleViewResults = () => {
    // Filter wines based on preference before passing to results
    const filteredWines = winePreference === 'all' 
      ? foundWines 
      : foundWines.filter(wine => wine.wineType === winePreference);
    
    if (filteredWines.length === 0 && winePreference !== 'all') {
      toast.info(`No ${winePreference} wines found`, {
        description: 'Showing all wines instead'
      });
      navigate('/results', { state: { wines: foundWines } });
    } else {
      navigate('/results', { state: { wines: filteredWines } });
    }
  };
  
  return (
    <PageContainer title="Scan Wine List" className="relative">
      <div className="flex flex-col items-center max-w-md mx-auto pb-6">
        <h1 className="text-2xl md:text-3xl font-serif mb-4 text-center">Scan Wine List</h1>
        <p className="text-muted-foreground text-center mb-6">
          Point your camera at a wine list to analyze prices and find the best values using AI.
        </p>
        
        {/* Wine Preferences - Only show when not processing */}
        {!isProcessing && scanStage === 'idle' && (
          <WinePreferences
            selectedType={winePreference}
            onSelectType={setWinePreference}
          />
        )}
        
        <ScanStatusSection
          networkError={networkError}
          offlineAvailable={offlineAvailable}
          showOfflineOptions={showOfflineOptions}
          scanStage={scanStage}
          scanMessage={scanMessage}
          isProcessing={isProcessing}
          onViewOfflineResults={handleViewOfflineResults}
          onRetry={handleRetry}
          onViewResults={handleViewResults}
        />
        
        <ScanContainer
          scanStage={scanStage}
          isProcessing={isProcessing}
          networkError={networkError}
          scanMessage={scanMessage}
          settings={settings}
          offlineAvailable={offlineAvailable}
          foundWines={foundWines}
          onImageCapture={handleImageCapture}
          onSimulateScan={simulateWineScan}
          onViewOfflineResults={handleViewOfflineResults}
          onViewResults={handleViewResults}
        />
        
        {!isProcessing && (
          <ScanTips />
        )}
      </div>
    </PageContainer>
  );
};

export default ScanPage;
