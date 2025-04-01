
import React from 'react';
import { cn } from '@/lib/utils';
import { Github, Heart, Wine } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn(
      "w-full py-6 px-6 bg-wine-dark text-cream text-sm mt-auto", 
      "dark:bg-black/90 transition-colors duration-300",
      className
    )}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Wine size={18} className="text-gold" />
          <p>© {new Date().getFullYear()} Wine Whisperer</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-wine-muted">
          <p className="flex items-center gap-1">
            <Heart size={14} className="text-wine" />
            <span>Find the best value wines at restaurants</span>
          </p>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-cream transition-colors">Home</Link>
            <Link to="/scan" className="hover:text-cream transition-colors">Scan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
