
import React from 'react';
import { cn } from '@/lib/utils';
import { Wine } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full py-4 px-6 flex items-center justify-between bg-wine/90 text-cream shadow-md", className)}>
      <Link to="/" className="flex items-center gap-2">
        <Wine size={28} className="text-gold" />
        <h1 className="text-xl font-serif font-semibold">Wine Whisperer</h1>
      </Link>
    </header>
  );
};

export default Header;
