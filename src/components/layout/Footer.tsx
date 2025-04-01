
import React from 'react';
import { cn } from '@/lib/utils';
import { Github, Heart, GlassWater } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn(
      "w-full py-6 px-6 mt-auto border-t border-border/20", 
      "transition-colors duration-300 backdrop-blur-sm",
      className
    )}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <GlassWater size={18} className="text-wine" />
          <p className="text-sm text-foreground/80 font-medium">© {new Date().getFullYear()} Wine Whisperer</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-muted-foreground">
          <p className="flex items-center gap-1 text-sm">
            <Heart size={14} className="text-wine" />
            <span className="font-light">Premium wine selection</span>
          </p>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm hover:text-foreground transition-colors font-light"
            >
              Home
            </Link>
            <Link 
              to="/scan" 
              className="text-sm hover:text-foreground transition-colors font-light"
            >
              Scan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
