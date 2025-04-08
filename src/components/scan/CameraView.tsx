
import React from 'react';
import { cn } from '@/lib/utils';
import CameraCapture from '@/components/camera/CameraCapture';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw, WifiOff, History } from 'lucide-react';

interface CameraViewProps {
  isProcessing: boolean;
  networkError: boolean;
  scanStage: 'idle' | 'capturing' | 'processing' | 'analyzing' | 'complete' | 'error';
  scanMessage: string;
  settings: { demoMode: boolean; [key: string]: any };
  offlineAvailable: boolean;
  onImageCapture: (imageData: string) => void;
  onSimulateScan: () => void;
  onViewOfflineResults: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({
  isProcessing,
  networkError,
  scanStage,
  scanMessage,
  settings,
  offlineAvailable,
  onImageCapture,
  onSimulateScan,
  onViewOfflineResults
}) => {
  return (
    <div className="relative">
      <CameraCapture 
        onImageCapture={onImageCapture} 
        disabled={isProcessing || networkError}
        className="aspect-[3/4] object-cover w-full"
      />
      
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center p-4">
            <RefreshCw className="animate-spin h-8 w-8 mb-2 mx-auto" />
            <p>{scanMessage}</p>
          </div>
        </div>
      )}
      
      {settings.demoMode && scanStage === 'idle' && !networkError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button 
            onClick={onSimulateScan} 
            variant="wine" 
            className="bg-wine/90 hover:bg-wine text-white"
            disabled={networkError}
          >
            <Camera className="mr-2 h-5 w-5" />
            Simulate Wine List Scan
          </Button>
        </div>
      )}
      
      {networkError && !isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center p-4">
            <WifiOff className="h-8 w-8 mb-2 mx-auto" />
            <p className="text-lg font-semibold">Network Unavailable</p>
            {offlineAvailable ? (
              <div className="mt-4">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={onViewOfflineResults}
                  className="bg-white/80 text-gray-900 hover:bg-white"
                >
                  <History className="mr-2 h-4 w-4" />
                  View Offline Results
                </Button>
              </div>
            ) : (
              <p className="mt-2">Please check your connection and try again</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraView;
