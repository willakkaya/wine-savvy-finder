
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';

interface NetworkErrorAlertProps {
  offlineAvailable: boolean;
}

const NetworkErrorAlert: React.FC<NetworkErrorAlertProps> = ({ offlineAvailable }) => {
  return (
    <Alert variant="destructive" className="mb-4 animate-pulse">
      <WifiOff className="h-4 w-4" />
      <AlertTitle>Network Unavailable</AlertTitle>
      <AlertDescription>
        {offlineAvailable ? 
          "You can view your previously scanned wines in offline mode." : 
          "Please check your internet connection and try again."}
      </AlertDescription>
    </Alert>
  );
};

export default NetworkErrorAlert;
