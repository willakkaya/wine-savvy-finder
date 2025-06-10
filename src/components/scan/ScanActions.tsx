
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Check, Sparkles, History } from 'lucide-react';
import { ScanStage } from '@/types/scanTypes';

interface ScanActionsProps {
  scanStage: ScanStage;
  isProcessing: boolean;
  networkError: boolean;
  offlineAvailable: boolean;
  onRetry: () => void;
  onViewResults: () => void;
  onViewOfflineResults: () => void;
}

const ScanActions: React.FC<ScanActionsProps> = memo(({
  scanStage,
  isProcessing,
  networkError,
  offlineAvailable,
  onRetry,
  onViewResults,
  onViewOfflineResults
}) => {
  const isIdle = scanStage === 'idle';
  const isComplete = scanStage === 'complete';
  const showOfflineButton = networkError && offlineAvailable;
  
  return (
    <div className="flex gap-4 w-full">
      <Button 
        onClick={onRetry}
        variant="outline" 
        className="flex-1"
        disabled={isProcessing}
      >
        <Camera className="mr-2 h-4 w-4" />
        {isIdle ? 'Scan' : 'Rescan'}
      </Button>
      
      {isComplete ? (
        <Button 
          onClick={onViewResults}
          variant="wine" 
          className="flex-1"
          disabled={isProcessing}
        >
          <Check className="mr-2 h-4 w-4" />
          View Results
        </Button>
      ) : showOfflineButton ? (
        <Button 
          onClick={onViewOfflineResults}
          variant="outline"
          className="flex-1 border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
        >
          <History className="mr-2 h-4 w-4" />
          Offline Results
        </Button>
      ) : (
        <Button 
          onClick={onViewResults}
          variant="outline" 
          className="flex-1"
          disabled={!isComplete || isProcessing}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Results
        </Button>
      )}
    </div>
  );
});

ScanActions.displayName = 'ScanActions';

export default ScanActions;
