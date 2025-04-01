
import React from 'react';
import { useNavigate } from 'react-router-dom';
import WineCard, { WineInfo } from './WineCard';
import { motion } from 'framer-motion';

interface WineCardLinkProps {
  wine: WineInfo;
  rank: number;
  className?: string;
  style?: React.CSSProperties;
}

const WineCardLink: React.FC<WineCardLinkProps> = ({ wine, rank, className, style }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/wine/${wine.id}`);
  };
  
  // Enhanced animation variants for a more premium, fluid experience
  const variants = {
    initial: { 
      scale: 1, 
      y: 0, 
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03)' 
    },
    hover: { 
      scale: 1.02, 
      y: -6,
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
      className="cursor-pointer"
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={variants}
      style={style}
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
