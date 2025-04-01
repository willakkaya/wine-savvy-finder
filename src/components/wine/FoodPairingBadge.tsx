
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
  // Define badge color based on strength
  const getBadgeStyles = () => {
    switch (pairing.strength) {
      case 'excellent':
        return 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/40';
      case 'good':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/40';
      case 'fair':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/40';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'flex items-center gap-1 py-1 px-2 border', 
        getBadgeStyles(),
        className
      )}
    >
      <Utensils size={12} />
      <span>{pairing.food}</span>
    </Badge>
  );
};

export default FoodPairingBadge;
