
import React from 'react';
import NetworkErrorAlert from '@/components/scan/NetworkErrorAlert';
import OfflineOptionsAlert from '@/components/scan/OfflineOptionsAlert';
import ScanProgress from '@/components/scan/ScanProgress';
import ScanActions from '@/components/scan/ScanActions';
import { ScanStage } from '@/hooks/useScanProcess';

interface ScanStatusSectionProps {
  networkError: boolean;
  offlineAvailable: boolean;
  showOfflineOptions: boolean;
  scanStage: ScanStage;
  scanMessage: string;
  isProcessing: boolean;
  onViewOfflineResults: () => void;
  onRetry: () => void;
  onViewResults: () => void;
}

const ScanStatusSection: React.FC<ScanStatusSectionProps> = ({
  networkError,
  offlineAvailable,
  showOfflineOptions,
  scanStage,
  scanMessage,
  isProcessing,
  onViewOfflineResults,
  onRetry,
  onViewResults
}) => {
  return (
    <>
      {networkError && (
        <NetworkErrorAlert offlineAvailable={offlineAvailable} />
      )}
      
      {showOfflineOptions && (
        <OfflineOptionsAlert onViewOfflineResults={onViewOfflineResults} />
      )}
      
      <div className="w-full mb-6">
        <ScanProgress 
          stage={scanStage} 
          message={scanMessage} 
        />
      </div>
      
      <ScanActions 
        scanStage={scanStage}
        isProcessing={isProcessing}
        networkError={networkError}
        offlineAvailable={offlineAvailable}
        onRetry={onRetry}
        onViewResults={onViewResults}
        onViewOfflineResults={onViewOfflineResults}
      />
    </>
  );
};

export default ScanStatusSection;
