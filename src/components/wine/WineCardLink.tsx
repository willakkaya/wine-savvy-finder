
import React from 'react';
import { useNavigate } from 'react-router-dom';
import WineCard, { WineInfo } from './WineCard';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface WineCardLinkProps {
  wine: WineInfo;
  rank: number;
  className?: string;
  style?: React.CSSProperties;
}

const WineCardLink: React.FC<WineCardLinkProps> = ({ wine, rank, className, style }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleClick = () => {
    navigate(`/wine/${wine.id}`);
  };
  
  // Enhanced animation variants with mobile-specific adjustments
  const variants = {
    initial: { 
      scale: 1, 
      y: 0, 
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03)' 
    },
    hover: { 
      scale: isMobile ? 1.01 : 1.02, // Smaller scale on mobile
      y: isMobile ? -3 : -6, // Less elevation on mobile
      boxShadow: '0 6px 16px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.03)',
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
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
  
  return (
    <motion.div 
      onClick={handleClick}
      className={`cursor-pointer ${isMobile ? 'touch-manipulation' : ''}`}
      initial="initial"
      whileHover={isMobile ? undefined : "hover"} // Disable hover animation on mobile
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

export default WineCardLink;
