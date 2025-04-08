
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

interface OfflineOptionsAlertProps {
  onViewOfflineResults: () => void;
}

const OfflineOptionsAlert: React.FC<OfflineOptionsAlertProps> = ({ onViewOfflineResults }) => {
  return (
    <Alert className="mb-4 bg-amber-50 border-amber-200">
      <History className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-700">Offline Mode Available</AlertTitle>
      <AlertDescription className="text-amber-700">
        <p className="mb-2">You can view your previously scanned wines while offline.</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
          onClick={onViewOfflineResults}
        >
          <History className="mr-2 h-4 w-4" />
          View Offline Results
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default OfflineOptionsAlert;
