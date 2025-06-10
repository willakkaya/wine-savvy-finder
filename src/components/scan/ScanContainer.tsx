
import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import CameraView from '@/components/scan/CameraView';
import ScanResultsPreview from '@/components/scan/ScanResultsPreview';
import { ScanStage } from '@/types/scanTypes';
import { WineInfo } from '@/components/wine/WineCard';

interface ScanContainerProps {
  scanStage: ScanStage;
  isProcessing: boolean;
  networkError: boolean;
  scanMessage: string;
  settings: { demoMode: boolean; [key: string]: any };
  offlineAvailable: boolean;
  foundWines: WineInfo[];
  onImageCapture: (imageData: string) => void;
  onSimulateScan: () => void;
  onViewOfflineResults: () => void;
  onViewResults: () => void;
}

const ScanContainer: React.FC<ScanContainerProps> = memo(({
  scanStage,
  isProcessing,
  networkError,
  scanMessage,
  settings,
  offlineAvailable,
  foundWines,
  onImageCapture,
  onSimulateScan,
  onViewOfflineResults,
  onViewResults
}) => {
  const isComplete = scanStage === 'complete';
  const topWine = foundWines[0];
  const highestRatedWine = foundWines[1];
  
  return (
    <div className={cn(
      "w-full overflow-hidden rounded-xl border border-border mb-4 transition-colors duration-200",
      isProcessing ? "bg-secondary/50" : "bg-card"
    )}>
      {isComplete ? (
        <ScanResultsPreview 
          resultsCount={foundWines.length} 
          onViewResults={onViewResults}
          topValueWine={topWine}
          highestRatedWine={highestRatedWine}
        />
      ) : (
        <CameraView 
          isProcessing={isProcessing}
          networkError={networkError}
          scanStage={scanStage}
          scanMessage={scanMessage}
          settings={settings}
          offlineAvailable={offlineAvailable}
          onImageCapture={onImageCapture}
          onSimulateScan={onSimulateScan}
          onViewOfflineResults={onViewOfflineResults}
        />
      )}
    </div>
  );
});

ScanContainer.displayName = 'ScanContainer';

export default ScanContainer;
