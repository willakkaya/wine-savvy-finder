
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Utensils } from 'lucide-react';
import { FoodPairing } from '@/utils/foodPairingUtils';
import { cn } from '@/lib/utils';

interface FoodPairingBadgeProps {
  pairing: FoodPairing;
  className?: string;
}

const FoodPairingBadge: React.FC<FoodPairingBadgeProps> = ({ pairing, className }) => {
  // Define badge color based on strength with more refined color palette
  const getBadgeStyles = () => {
    switch (pairing.strength) {
      case 'excellent':
        return 'bg-green-50 text-green-700 hover:bg-green-100 border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30';
      case 'good':
        return 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30';
      case 'fair':
        return 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/30';
      default:
        return 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-100 dark:bg-gray-800/40 dark:text-gray-300 dark:hover:bg-gray-800/60';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'flex items-center gap-1.5 py-1.5 px-3 rounded-full border backdrop-blur-sm transition-all duration-200 shadow-sm', 
        getBadgeStyles(),
        className
      )}
    >
      <Utensils size={12} className="opacity-70" />
      <span className="font-medium text-xs">{pairing.food}</span>
    </Badge>
  );
};

export default FoodPairingBadge;
