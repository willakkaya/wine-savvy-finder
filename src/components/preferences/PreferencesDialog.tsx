
import React from 'react';
import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PreferencesForm from './PreferencesForm';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface PreferencesDialogProps {
  trigger?: React.ReactNode;
  showWelcome?: boolean;
}

const PreferencesDialog: React.FC<PreferencesDialogProps> = ({ 
  trigger,
  showWelcome = false
}) => {
  const [open, setOpen] = React.useState(false);
  const { hasSetPreferences, setHasSetPreferences } = useUserPreferences();

  // If showWelcome is true and user hasn't set preferences, show dialog automatically
  React.useEffect(() => {
    if (showWelcome && !hasSetPreferences) {
      setOpen(true);
    }
  }, [showWelcome, hasSetPreferences]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {showWelcome ? 'Welcome to Wine Whisperer!' : 'Your Wine Preferences'}
          </DialogTitle>
          <DialogDescription>
            {showWelcome 
              ? 'Tell us about your wine preferences to help us personalize your experience.'
              : 'Update your wine preferences to get better recommendations.'}
          </DialogDescription>
        </DialogHeader>
        <PreferencesForm />
        {showWelcome && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => {
                setHasSetPreferences(true);
                setOpen(false);
              }}
            >
              Skip for now
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PreferencesDialog;
