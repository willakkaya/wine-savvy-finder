
import React from 'react';
import { useNavigate } from 'react-router-dom';
import WineCard, { WineInfo } from './WineCard';

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
  
  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-md"
    >
      <WineCard 
        wine={wine} 
        rank={rank} 
        className={className}
        style={style}
      />
    </div>
  );
};

export default WineCardLink;
