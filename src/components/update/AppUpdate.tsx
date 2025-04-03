
import React, { useEffect, useState } from 'react';
import { handleServiceWorkerUpdates, updateServiceWorker } from '@/utils/serviceWorker';
import { toast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const AppUpdate: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateChecked, setUpdateChecked] = useState(false);

  useEffect(() => {
    // Handle service worker updates
    handleServiceWorkerUpdates(() => {
      setUpdateAvailable(true);
      
      // Show a persistent toast with update button
      toast({
        title: "Update Available",
        description: "A new version of WineCheck is available. Click to update.",
        action: (
          <Button 
            size="sm" 
            onClick={handleUpdate}
            className="bg-wine hover:bg-wine/90 text-white flex items-center gap-1"
          >
            <RefreshCw size={14} className="animate-spin-slow" />
            Update
          </Button>
        ),
        duration: 0, // Don't auto-dismiss
      });
      
      // Also show a more visible sonner toast
      sonnerToast("New version available!", {
        description: "A new version is ready to install",
        action: {
          label: "Update now",
          onClick: handleUpdate,
        },
        duration: 10000,
        position: "top-center",
      });
    });

    // Periodically check for updates if the user hasn't updated yet
    const checkInterval = setInterval(() => {
      if (!updateAvailable && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.update().then(() => {
            setUpdateChecked(true);
            console.log('Service worker update check completed');
          });
        });
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => {
      clearInterval(checkInterval);
    };
  }, [updateAvailable]);

  const handleUpdate = () => {
    updateServiceWorker();
    
    // Show updating toast
    sonnerToast.loading("Updating application...", {
      position: "top-center",
    });
    
    // Give a moment for the service worker to activate
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return null; // This is a non-visual component
};

export default AppUpdate;
