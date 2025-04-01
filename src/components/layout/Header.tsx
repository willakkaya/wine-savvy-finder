
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wine, Menu, X, Heart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-cream border-b border-wine/10 sticky top-0 z-50 shadow-sm backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Wine className="h-8 w-8 text-wine" />
              <span className="ml-2 text-xl font-serif text-wine-dark">WineCheck</span>
            </Link>
            
            {/* Desktop navigation */}
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') 
                    ? 'text-wine bg-wine/5' 
                    : 'text-wine-dark hover:bg-wine/5 hover:text-wine transition-colors'
                }`}
              >
                Home
              </Link>
              <Link
                to="/scan"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/scan') 
                    ? 'text-wine bg-wine/5' 
                    : 'text-wine-dark hover:bg-wine/5 hover:text-wine transition-colors'
                }`}
              >
                Scan
              </Link>
              <Link
                to="/favorites"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/favorites') 
                    ? 'text-wine bg-wine/5' 
                    : 'text-wine-dark hover:bg-wine/5 hover:text-wine transition-colors'
                }`}
              >
                Favorites
              </Link>
              <Link
                to="/settings"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/settings') 
                    ? 'text-wine bg-wine/5' 
                    : 'text-wine-dark hover:bg-wine/5 hover:text-wine transition-colors'
                }`}
              >
                Settings
              </Link>
            </nav>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              className="text-wine"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="sm:hidden bg-cream/95 backdrop-blur-sm">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'text-wine bg-wine/5' 
                  : 'text-wine-dark hover:bg-wine/5 hover:text-wine transition-colors'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/scan"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/scan') 
                  ? 'text-wine bg-wine/5' 
                  : 'text-wine-dark hover:bg-wine/5 hover:text-wine transition-colors'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Scan
            </Link>
            <Link
              to="/favorites"
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive('/favorites') 
                  ? 'text-wine bg-wine/5' 
                  : 'text-wine-dark hover:bg-wine/5 hover:text-wine transition-colors'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className="mr-2 h-4 w-4" />
              Favorites
            </Link>
            <Link
              to="/settings"
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive('/settings') 
                  ? 'text-wine bg-wine/5' 
                  : 'text-wine-dark hover:bg-wine/5 hover:text-wine transition-colors'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
