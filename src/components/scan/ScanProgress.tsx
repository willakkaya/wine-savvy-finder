
import React, { memo, useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Wine, Camera, Search, Database, AlertTriangle } from 'lucide-react';
import { ScanStage } from '@/types/scanTypes';

interface ScanProgressProps {
  stage: ScanStage;
  message?: string;
}

const STAGE_CONFIG = {
  idle: { percentage: 0, icon: Camera, message: 'Ready to scan', animate: false },
  capturing: { percentage: 25, icon: Camera, message: 'Capturing image...', animate: true },
  processing: { percentage: 50, icon: Wine, message: 'Processing wine list...', animate: true },
  analyzing: { percentage: 75, icon: Search, message: 'Analyzing and matching wines...', animate: true },
  complete: { percentage: 100, icon: Database, message: 'Analysis complete!', animate: false },
  error: { percentage: 100, icon: AlertTriangle, message: 'Error processing wine list', animate: false }
} as const;

const ScanProgress: React.FC<ScanProgressProps> = memo(({ stage, message }) => {
  const config = useMemo(() => STAGE_CONFIG[stage], [stage]);
  
  const IconComponent = config.icon;
  const isError = stage === 'error';
  const displayMessage = message || config.message;
  
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconComponent 
            className={`${isError ? 'text-destructive' : 'text-wine'} ${config.animate ? 'animate-pulse' : ''}`} 
          />
          <span className="text-sm font-medium">{displayMessage}</span>
        </div>
        <span className="text-xs text-muted-foreground">{config.percentage}%</span>
      </div>
      <Progress 
        value={config.percentage} 
        className={`h-2 ${isError ? 'bg-destructive/20' : ''}`}
      />
    </div>
  );
});

ScanProgress.displayName = 'ScanProgress';

export default ScanProgress;
