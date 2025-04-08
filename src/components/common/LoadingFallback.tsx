
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingFallback: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
};

export default LoadingFallback;
