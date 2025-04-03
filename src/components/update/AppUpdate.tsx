
import React, { useEffect, useState } from 'react';
import { handleServiceWorkerUpdates, updateServiceWorker } from '@/utils/serviceWorker';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const AppUpdate: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    handleServiceWorkerUpdates(() => {
      setUpdateAvailable(true);
      
      toast({
        title: "Update Available",
        description: "A new version of WineCheck is available. Click to update.",
        action: (
          <Button 
            size="sm" 
            onClick={handleUpdate}
            className="bg-wine hover:bg-wine/90 text-white flex items-center gap-1"
          >
            <RefreshCw size={14} />
            Update
          </Button>
        ),
        duration: 0, // Don't auto-dismiss
      });
    });
  }, []);

  const handleUpdate = () => {
    updateServiceWorker();
    window.location.reload();
  };

  return null; // This is a non-visual component
};

export default AppUpdate;
