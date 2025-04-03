
import React, { useEffect, useState } from 'react';
import { handleServiceWorkerUpdates, updateServiceWorker, isUsingServiceWorker } from '@/utils/serviceWorker';
import { toast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const AppUpdate: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateChecked, setUpdateChecked] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateInProgress, setUpdateInProgress] = useState(false);

  useEffect(() => {
    // Only proceed if service worker is supported
    if (!isUsingServiceWorker()) {
      console.log('Service worker is not supported or not registered');
      return;
    }

    // Handle service worker updates
    handleServiceWorkerUpdates(() => {
      setUpdateAvailable(true);
      setShowUpdateDialog(true);
      
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
      if (!updateAvailable && isUsingServiceWorker()) {
        navigator.serviceWorker.ready.then(registration => {
          registration.update().then(() => {
            setUpdateChecked(true);
            console.log('Service worker update check completed');
          }).catch(err => {
            console.error('Service worker update check failed:', err);
          });
        });
      }
    }, 60 * 60 * 1000); // Check every hour

    // Check for updates when the app comes back online
    window.addEventListener('online', handleOnlineEvent);

    return () => {
      clearInterval(checkInterval);
      window.removeEventListener('online', handleOnlineEvent);
    };
  }, [updateAvailable]);

  const handleOnlineEvent = () => {
    console.log('App is back online, checking for updates...');
    if (isUsingServiceWorker()) {
      navigator.serviceWorker.ready.then(registration => {
        registration.update().catch(err => {
          console.error('Service worker update check failed after coming online:', err);
        });
      });
    }
  };

  const handleUpdate = () => {
    setUpdateInProgress(true);
    updateServiceWorker();
    
    // Show updating toast
    sonnerToast.loading("Updating application...", {
      position: "top-center",
    });
    
    // Give a moment for the service worker to activate
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const dismissUpdate = () => {
    setShowUpdateDialog(false);
    // We don't reset updateAvailable, so the user can still update later
  };

  return (
    <>
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>App Update Available</DialogTitle>
            <DialogDescription>
              A new version of WineCheck is ready to install. Update now for the latest features and improvements.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button 
              variant="outline" 
              onClick={dismissUpdate}
              disabled={updateInProgress}
            >
              Later
            </Button>
            <Button 
              className="bg-wine hover:bg-wine/90 text-white"
              onClick={handleUpdate}
              disabled={updateInProgress}
            >
              {updateInProgress ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>Update Now</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppUpdate;
