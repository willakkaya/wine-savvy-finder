
import React from 'react';
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

const ScanContainer: React.FC<ScanContainerProps> = ({
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
  return (
    <div className={cn(
      "w-full overflow-hidden rounded-xl border border-border mb-4",
      isProcessing ? "bg-secondary/50" : "bg-card"
    )}>
      {scanStage !== 'complete' ? (
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
      ) : (
        <ScanResultsPreview 
          resultsCount={foundWines.length} 
          onViewResults={onViewResults}
          topValueWine={foundWines.length > 0 ? foundWines[0] : undefined}
          highestRatedWine={foundWines.length > 1 ? foundWines[1] : undefined}
        />
      )}
    </div>
  );
};

export default ScanContainer;
