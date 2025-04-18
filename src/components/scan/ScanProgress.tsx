
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Wine, Camera, Search, Database, AlertTriangle } from 'lucide-react';
import { ScanStage } from '@/types/scanTypes';

interface ScanProgressProps {
  stage: ScanStage;
  message?: string;
}

const ScanProgress: React.FC<ScanProgressProps> = ({ stage, message }) => {
  const getStagePercentage = () => {
    switch (stage) {
      case 'idle': return 0;
      case 'capturing': return 25;
      case 'processing': return 50;
      case 'analyzing': return 75;
      case 'complete': return 100;
      case 'error': return 100; // Show full progress bar for error state
      default: return 0;
    }
  };
  
  const getStageIcon = () => {
    switch (stage) {
      case 'capturing': return <Camera className="text-wine animate-pulse" />;
      case 'processing': return <Wine className="text-wine animate-pulse" />;
      case 'analyzing': return <Search className="text-wine animate-pulse" />;
      case 'complete': return <Database className="text-wine" />;
      case 'error': return <AlertTriangle className="text-destructive" />;
      default: return <Camera className="text-wine" />;
    }
  };
  
  const getDefaultMessage = () => {
    switch (stage) {
      case 'idle': return 'Ready to scan';
      case 'capturing': return 'Capturing image...';
      case 'processing': return 'Processing wine list...';
      case 'analyzing': return 'Analyzing and matching wines...';
      case 'complete': return 'Analysis complete!';
      case 'error': return 'Error processing wine list';
      default: return '';
    }
  };
  
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStageIcon()}
          <span className="text-sm font-medium">{message || getDefaultMessage()}</span>
        </div>
        <span className="text-xs text-muted-foreground">{getStagePercentage()}%</span>
      </div>
      <Progress 
        value={getStagePercentage()} 
        className={`h-2 ${stage === 'error' ? 'bg-destructive/20' : ''}`}
      />
    </div>
  );
};

export default ScanProgress;
