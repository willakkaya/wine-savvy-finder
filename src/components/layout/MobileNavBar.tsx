
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Settings, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { isNativePlatform } from '@/utils/versionUtils';

const MobileNavBar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isNative = isNativePlatform();
  
  // Don't render on desktop
  if (!isMobile) return null;
  
  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/scan', label: 'Scan', icon: Search },
    { path: '/favorites', label: 'Favorites', icon: Heart },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
  ];
  
  return (
    <div className="sm:hidden fixed inset-x-0 bottom-0 z-50">
      <nav className={cn(
        "bg-white border-t border-gray-200 shadow-lg",
        isNative ? "safe-area-bottom" : "pb-2"
      )}>
        <div className="flex justify-around max-w-md mx-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center px-2 py-2 text-xs font-medium",
                "min-w-[64px] min-h-[60px] touch-manipulation",
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
                  "mb-1",
                  isActive(item.path) ? "text-wine" : "text-gray-500"
                )} 
              />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MobileNavBar;
