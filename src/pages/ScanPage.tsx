
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
import { PriceRangeSelector, PriceRange } from '@/components/scan/PriceRangeSelector';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useScanProcess } from '@/hooks/useScanProcess';
import { toast } from 'sonner';

const ScanPage = () => {
  const { settings } = useAppSettings();
  const navigate = useNavigate();
  const [winePreference, setWinePreference] = useState<WineType>('all');
  const [scenarioPreference, setScenarioPreference] = useState<ScenarioType>('casual');
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 100 });
  
  // Automatically adjust price range when scenario changes
  const handleScenarioChange = (scenario: ScenarioType) => {
    setScenarioPreference(scenario);
    
    // Set appropriate budget based on scenario
    switch (scenario) {
      case 'impress':
        setPriceRange({ min: 50, max: 500 }); // Luxury range
        break;
      case 'savings':
        setPriceRange({ min: 0, max: 50 }); // Budget friendly
        break;
      case 'casual':
      default:
        setPriceRange({ min: 40, max: 100 }); // Moderate range
        break;
    }
  };
  
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
    console.log('=== FILTERING DEBUG ===');
    console.log('Scenario:', scenarioPreference);
    console.log('Price Range:', priceRange);
    console.log('Wine preference selected:', winePreference);
    console.log('Total wines found:', foundWines.length);
    console.log('Wine types in results:', foundWines.map(w => `${w.name}: ${w.wineType}`));
    
    // Filter wines based on preference and price range
    let filteredWines = winePreference === 'all' 
      ? foundWines 
      : foundWines.filter(wine => {
          const matches = wine.wineType === winePreference;
          console.log(`${wine.name} (${wine.wineType}) matches ${winePreference}? ${matches}`);
          return matches;
        });
    
    console.log('After type filter:', filteredWines.length);
    console.log('Wines after type filter:', filteredWines.map(w => `${w.name}: $${w.price}`));
    
    // Filter by price range
    filteredWines = filteredWines.filter(wine => {
      const inRange = wine.price >= priceRange.min && wine.price <= priceRange.max;
      console.log(`${wine.name} ($${wine.price}) in range $${priceRange.min}-$${priceRange.max}? ${inRange}`);
      return inRange;
    });
    
    console.log('After price filter:', filteredWines.length);
    console.log('Final wines:', filteredWines.map(w => `${w.name}: $${w.price}`));
    
    if (filteredWines.length === 0) {
      toast.info('No wines match your filters', {
        description: 'Try adjusting your preferences or showing all wines'
      });
      navigate('/results', { state: { wines: foundWines, scenario: scenarioPreference, priceRange } });
    } else {
      navigate('/results', { state: { wines: filteredWines, scenario: scenarioPreference, priceRange } });
    }
  };
  
  return (
    <PageContainer title="Scan Wine List" className="relative">
      <div className="flex flex-col items-center max-w-5xl mx-auto pb-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-serif">Scan Wine List</h1>
          <p className="text-muted-foreground text-sm">
            Point your camera at a wine list to analyze prices and find the best values using AI.
          </p>
        </div>
        
        {/* Preferences - Always show before and during scan */}
        {scanStage !== 'complete' && (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3">
            <ScenarioPreferences
              selectedScenario={scenarioPreference}
              onSelectScenario={handleScenarioChange}
            />
            <WinePreferences
              selectedType={winePreference}
              onSelectType={setWinePreference}
            />
            <PriceRangeSelector
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
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
