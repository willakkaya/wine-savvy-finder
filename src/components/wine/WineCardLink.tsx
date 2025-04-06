
import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import WineCard, { WineInfo } from './WineCard';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { isNativePlatform } from '@/utils/versionUtils';

interface WineCardLinkProps {
  wine: WineInfo;
  rank: number;
  className?: string;
  style?: React.CSSProperties;
}

const WineCardLink: React.FC<WineCardLinkProps> = ({ wine, rank, className, style }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isNative = isNativePlatform();
  
  const handleClick = () => {
    navigate(`/wine/${wine.id}`);
  };
  
  // Mobile-optimized variants with reduced animations for better performance
  const variants = {
    initial: { 
      scale: 1, 
      y: 0, 
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03)' 
    },
    hover: { 
      scale: isMobile ? 1.01 : 1.02, // Smaller scale on mobile
      y: isMobile ? -2 : -6, // Less elevation on mobile
      boxShadow: '0 6px 16px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.03)',
      transition: { 
        type: "spring", 
        stiffness: isMobile ? 400 : 300, // Faster springs on mobile
        damping: isMobile ? 25 : 20,
        mass: isMobile ? 0.8 : 1  // Lighter mass for faster mobile animations
      }
    },
    tap: { 
      scale: 0.98,
      boxShadow: '0 1px 2px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.03)',
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30 
      }
    }
  };
  
  // For mobile, reduce motion even further on native platforms
  if (isMobile || isNative) {
    return (
      <div 
        onClick={handleClick}
        className="cursor-pointer touch-manipulation active:scale-[0.98] transition-transform"
        style={style}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${wine.name}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <WineCard 
          wine={wine} 
          rank={rank} 
          className={className}
        />
      </div>
    );
  }
  
  // Use full animations for desktop
  return (
    <motion.div 
      onClick={handleClick}
      className="cursor-pointer"
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={variants}
      style={style}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${wine.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <WineCard 
        wine={wine} 
        rank={rank} 
        className={className}
      />
    </motion.div>
  );
};

export default memo(WineCardLink);
