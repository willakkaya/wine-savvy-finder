
import React from 'react';
import { Link } from 'react-router-dom';
import { config } from '@/lib/config';
import { Facebook, Instagram, Twitter, HelpCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isMobile = useIsMobile();
  
  return (
    <footer className="w-full py-4 md:py-6 px-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">WineCheck</h3>
            <p className="text-muted-foreground text-xs md:text-sm mb-3 md:mb-4">
              Discover the best value wines on restaurant wine lists with our AI-powered analysis.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/winecheck" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram size={isMobile ? 18 : 20} />
              </a>
              <a href="https://twitter.com/winecheck" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={isMobile ? 18 : 20} />
              </a>
              <a href="https://facebook.com/winecheck" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook size={isMobile ? 18 : 20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">Resources</h3>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link to="/learn" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center">
                  Learn About Wine
                </Link>
              </li>
              <li>
                <a href="https://blog.winewhisperer.com" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center">
                  Blog
                </a>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center">
                  <HelpCircle className="mr-1 h-3 w-3" />
                  FAQ
                </Link>
              </li>
              <li>
                <a href="mailto:support@winewhisperer.com" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">Legal</h3>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-4 md:pt-6 border-t text-center text-xs md:text-sm text-muted-foreground">
          <p>© {currentYear} WineCheck. All rights reserved.</p>
          <p className="mt-1 md:mt-2">
            WineCheck is not affiliated with any restaurants or wine producers. 
            Prices and availability subject to change.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
