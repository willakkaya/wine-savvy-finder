
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
  
  // Animation variants for subtle hover and tap effects
  const variants = {
    initial: { scale: 1, y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.06)' },
    hover: { 
      scale: 1.02, 
      y: -4,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 20px 40px rgba(0,0,0,0.12)',
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    tap: { 
      scale: 0.98,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)',
      transition: { duration: 0.2, ease: 'easeOut' }
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
