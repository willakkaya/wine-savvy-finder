
import React from 'react';
import { cn } from '@/lib/utils';
import { Github } from 'lucide-react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn("w-full py-4 px-6 bg-wine-dark text-cream text-sm", className)}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <p>© {new Date().getFullYear()} Wine Whisperer</p>
        </div>
        <p className="text-wine-muted">Find the best value wines at restaurants</p>
      </div>
    </footer>
  );
};

export default Footer;
