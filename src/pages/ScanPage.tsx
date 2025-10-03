
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import ScanTips from '@/components/scan/ScanTips';
import ScanContainer from '@/components/scan/ScanContainer';
import ScanProgress from '@/components/scan/ScanProgress';
import ScanActions from '@/components/scan/ScanActions';
import NetworkErrorAlert from '@/components/scan/NetworkErrorAlert';
import OfflineOptionsAlert from '@/components/scan/OfflineOptionsAlert';
import { WinePreferences, WineType } from '@/components/scan/WinePreferences';
import { ScenarioPreferences, ScenarioType } from '@/components/scan/ScenarioPreferences';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useScanProcess } from '@/hooks/useScanProcess';
import { toast } from 'sonner';

const ScanPage = () => {
  const { settings } = useAppSettings();
  const navigate = useNavigate();
  const [winePreference, setWinePreference] = useState<WineType>('all');
  const [scenarioPreference, setScenarioPreference] = useState<ScenarioType>('casual');
  
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
      navigate('/results', { state: { wines: foundWines, scenario: scenarioPreference } });
    } else {
      navigate('/results', { state: { wines: filteredWines, scenario: scenarioPreference } });
    }
  };
  
  return (
    <PageContainer title="Scan Wine List" className="relative">
      <div className="flex flex-col items-center max-w-md mx-auto pb-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-serif">Scan Wine List</h1>
          <p className="text-muted-foreground text-sm">
            Point your camera at a wine list to analyze prices and find the best values using AI.
          </p>
        </div>
        
        {/* Preferences - Always show before and during scan */}
        {scanStage !== 'complete' && (
          <div className="w-full space-y-4">
            <ScenarioPreferences
              selectedScenario={scenarioPreference}
              onSelectScenario={setScenarioPreference}
            />
            <WinePreferences
              selectedType={winePreference}
              onSelectType={setWinePreference}
            />
          </div>
        )}
        
        {/* Network/Offline Alerts */}
        {networkError && (
          <NetworkErrorAlert offlineAvailable={offlineAvailable} />
        )}
        
        {showOfflineOptions && (
          <OfflineOptionsAlert onViewOfflineResults={handleViewOfflineResults} />
        )}
        
        {/* Scan Progress - Only show when processing */}
        {isProcessing && (
          <div className="w-full">
            <ScanProgress 
              stage={scanStage} 
              message={scanMessage} 
            />
          </div>
        )}
        
        {/* Main Scan Container */}
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
        
        {/* Action Buttons - Only show when needed */}
        {(scanStage === 'complete' || (scanStage === 'error' && !isProcessing)) && (
          <ScanActions 
            scanStage={scanStage}
            isProcessing={isProcessing}
            networkError={networkError}
            offlineAvailable={offlineAvailable}
            onRetry={handleRetry}
            onViewResults={handleViewResults}
            onViewOfflineResults={handleViewOfflineResults}
          />
        )}
        
        {/* Tips - Only show when idle */}
        {!isProcessing && scanStage === 'idle' && (
          <ScanTips />
        )}
      </div>
    </PageContainer>
  );
};

export default ScanPage;
