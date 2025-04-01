
import React from 'react';
import { cn } from '@/lib/utils';
import { Wine, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const location = useLocation();
  
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full py-4 px-6 flex items-center justify-between",
      "bg-wine/90 text-cream backdrop-blur-md shadow-md",
      "dark:bg-wine-dark/90 transition-colors duration-300",
      className
    )}>
      <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
        <Wine size={28} className="text-gold animate-float" />
        <h1 className="text-xl font-serif font-semibold">Wine Whisperer</h1>
      </Link>
      
      <div className="flex items-center gap-3">
        {location.pathname !== '/scan' && (
          <Button asChild variant="ghost" className="text-cream hover:bg-wine-dark/30">
            <Link to="/scan" className="flex items-center gap-2">
              <Search size={18} />
              <span className="hidden sm:inline">Scan Wine List</span>
            </Link>
          </Button>
        )}
        
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
