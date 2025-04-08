
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Check, Sparkles, History } from 'lucide-react';

interface ScanActionsProps {
  scanStage: 'idle' | 'capturing' | 'processing' | 'analyzing' | 'complete' | 'error';
  isProcessing: boolean;
  networkError: boolean;
  offlineAvailable: boolean;
  onRetry: () => void;
  onViewResults: () => void;
  onViewOfflineResults: () => void;
}

const ScanActions: React.FC<ScanActionsProps> = ({
  scanStage,
  isProcessing,
  networkError,
  offlineAvailable,
  onRetry,
  onViewResults,
  onViewOfflineResults
}) => {
  return (
    <div className="flex gap-4 w-full">
      <Button 
        onClick={onRetry}
        variant="outline" 
        className="flex-1"
        disabled={isProcessing}
      >
        <Camera className="mr-2 h-4 w-4" />
        {scanStage !== 'idle' ? 'Rescan' : 'Scan'}
      </Button>
      
      {scanStage === 'complete' ? (
        <Button 
          onClick={onViewResults}
          variant="wine" 
          className="flex-1"
          disabled={isProcessing}
        >
          <Check className="mr-2 h-4 w-4" />
          View Results
        </Button>
      ) : networkError && offlineAvailable ? (
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
          disabled={scanStage !== 'complete'}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Results
        </Button>
      )}
    </div>
  );
};

export default ScanActions;
