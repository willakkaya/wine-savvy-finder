
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Settings, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileNavBar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Don't render on desktop
  if (!isMobile) return null;
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/scan', label: 'Scan', icon: Search },
    { path: '/favorites', label: 'Favorites', icon: Heart },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 px-2 py-1 safe-area-bottom">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center px-3 py-2 text-xs font-medium rounded-md",
              "min-w-[68px] min-h-[64px] touch-manipulation",
              "transition-colors duration-200 active:scale-95",
              isActive(item.path)
                ? "text-wine"
                : "text-gray-500 hover:text-wine-dark active:text-wine"
            )}
            aria-current={isActive(item.path) ? "page" : undefined}
            aria-label={item.label}
          >
            <item.icon 
              size={24} 
              className={cn(
                isActive(item.path) ? "text-wine" : "text-gray-500",
                "transition-colors"
              )} 
            />
            <span className="mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavBar;
