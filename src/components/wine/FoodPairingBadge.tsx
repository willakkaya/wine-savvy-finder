
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Utensils } from 'lucide-react';
import { FoodPairing } from '@/utils/foodPairingUtils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FoodPairingBadgeProps {
  pairing: FoodPairing;
  className?: string;
}

const FoodPairingBadge: React.FC<FoodPairingBadgeProps> = ({ pairing, className }) => {
  // Refined badge color based on strength with more elegant color palette
  const getBadgeStyles = () => {
    switch (pairing.strength) {
      case 'excellent':
        return 'bg-green-50/80 text-green-800 hover:bg-green-100/90 border-green-100/50 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30';
      case 'good':
        return 'bg-blue-50/80 text-blue-800 hover:bg-blue-100/90 border-blue-100/50 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30';
      case 'fair':
        return 'bg-amber-50/80 text-amber-800 hover:bg-amber-100/90 border-amber-100/50 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/30';
      default:
        return 'bg-stone-50/80 text-stone-800 hover:bg-stone-100/90 border-stone-100/50 dark:bg-stone-800/40 dark:text-stone-300 dark:hover:bg-stone-800/60';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Badge 
        variant="outline" 
        className={cn(
          'flex items-center gap-1.5 py-1.5 px-3 rounded-full border backdrop-blur-sm transition-all duration-300 shadow-sm', 
          getBadgeStyles(),
          className
        )}
      >
        <Utensils size={12} className="opacity-70" />
        <span className="font-medium text-xs">{pairing.food}</span>
      </Badge>
    </motion.div>
  );
};

export default FoodPairingBadge;
