
import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { WineInfo } from './WineCard';

interface ShareButtonProps {
  wine: WineInfo;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ wine, className }) => {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent card click
    
    const shareText = `Check out this great wine value I found with Wine Whisperer!\n\n${wine.name} (${wine.year}) - $${wine.price} (${(((wine.marketPrice - wine.price) / wine.marketPrice) * 100).toFixed(0)}% below market price!)`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Wine Value Find',
        text: shareText,
        url: window.location.origin
      })
      .catch(error => {
        console.error('Error sharing:', error);
        copyToClipboard(shareText);
      });
    } else {
      copyToClipboard(shareText);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Share this wine value with friends!",
        });
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        toast({
          title: "Couldn't copy to clipboard",
          description: "Please try again",
          variant: "destructive"
        });
      });
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={className}
      onClick={handleShare}
      aria-label="Share this wine"
    >
      <Share2 size={16} />
    </Button>
  );
};

export default ShareButton;
