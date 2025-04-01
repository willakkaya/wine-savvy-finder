
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { GlassWater, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full py-4 px-6 flex items-center justify-between",
      "transition-all duration-300 ease-in-out",
      scrolled 
        ? "apple-glass shadow-sm backdrop-blur-xl" 
        : "bg-transparent",
      className
    )}>
      <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
        <GlassWater size={28} className="text-wine animate-float" />
        <h1 className="text-xl font-serif font-semibold text-foreground">Wine Whisperer</h1>
      </Link>
      
      <div className="flex items-center gap-3">
        {location.pathname !== '/scan' && (
          <Button asChild variant="ghost" className="text-foreground hover:bg-muted/80 rounded-full px-5">
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
