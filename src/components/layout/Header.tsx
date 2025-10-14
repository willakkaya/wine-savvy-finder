
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wine, Menu, X, Heart, Settings, HelpCircle, BookOpen, LogOut, LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, signOut, hasRole } = useAuth();
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  // Close menu on escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isMenuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMenuOpen]);
  
  // Handle iOS viewport height calculation
  useEffect(() => {
    const updateVh = () => {
      // Set the value of --vh to the actual viewport height
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    
    // Update immediately and on resize
    updateVh();
    window.addEventListener('resize', updateVh);
    
    return () => window.removeEventListener('resize', updateVh);
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-cream border-b border-wine/10 sticky top-0 z-50 shadow-sm backdrop-blur-lg safe-area-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 md:h-16 items-center">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Wine className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-wine`} />
              <span className={`ml-2 ${isMobile ? 'text-lg' : 'text-xl'} font-serif text-wine-dark`}>
                WineCheck
              </span>
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
                to="/learn"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/learn') 
                    ? 'text-wine bg-wine/5' 
                    : 'text-wine-dark hover:bg-wine/5 hover:text-wine transition-colors'
                }`}
              >
                Learn
              </Link>
              <Link
                to="/wine-database"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/wine-database') 
                    ? 'text-wine bg-wine/5' 
                    : 'text-wine-dark hover:bg-wine/5 hover:text-wine transition-colors'
                }`}
              >
                Database
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
          
          {/* Desktop auth buttons */}
          <div className="hidden sm:flex items-center space-x-2">
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="text-wine-dark hover:text-wine">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                {hasRole('restaurant_partner') && (
                  <Link to="/restaurant-dashboard">
                    <Button variant="ghost" size="sm" className="text-wine-dark hover:text-wine">
                      Restaurant
                    </Button>
                  </Link>
                )}
                {hasRole('corporate_admin') && (
                  <Link to="/corporate-dashboard">
                    <Button variant="ghost" size="sm" className="text-wine-dark hover:text-wine">
                      Corporate
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-wine-dark hover:text-wine"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-wine-dark hover:text-wine"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              className="text-wine touch-manipulation p-2"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <span className="sr-only">{isMenuOpen ? "Close main menu" : "Open main menu"}</span>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-cream/95 backdrop-blur-sm overflow-y-auto" style={{ top: '56px' }}>
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-4 py-3 rounded-md text-base font-medium touch-manipulation ${
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
              className={`block px-4 py-3 rounded-md text-base font-medium touch-manipulation ${
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
              className={`flex items-center px-4 py-3 rounded-md text-base font-medium touch-manipulation ${
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
              className={`flex items-center px-4 py-3 rounded-md text-base font-medium touch-manipulation ${
                isActive('/settings') 
                  ? 'text-wine bg-wine/5' 
                  : 'text-wine-dark hover:bg-wine/5 hover:text-wine transition-colors'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
            <Link
              to="/faq"
              className={`flex items-center px-4 py-3 rounded-md text-base font-medium touch-manipulation ${
                isActive('/learn') 
                  ? 'text-wine bg-wine/5' 
                  : 'text-wine-dark hover:bg-wine/5 hover:text-wine transition-colors'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Learn
            </Link>
            <Link
              to="/faq"
              className={`flex items-center px-4 py-3 rounded-md text-base font-medium touch-manipulation ${
                isActive('/faq') 
                  ? 'text-wine bg-wine/5' 
                  : 'text-wine-dark hover:bg-wine/5 hover:text-wine transition-colors'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              FAQ
            </Link>
            
            {/* Mobile auth button */}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`flex items-center px-4 py-3 rounded-md text-base font-medium touch-manipulation ${
                    isActive('/profile') 
                      ? 'text-wine bg-wine/5' 
                      : 'text-wine-dark hover:bg-wine/5 hover:text-wine transition-colors'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut();
                  }}
                  className="flex items-center w-full px-4 py-3 rounded-md text-base font-medium touch-manipulation text-wine-dark hover:bg-wine/5 hover:text-wine transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center px-4 py-3 rounded-md text-base font-medium touch-manipulation text-wine-dark hover:bg-wine/5 hover:text-wine transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
