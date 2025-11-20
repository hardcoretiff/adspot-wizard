
import React from 'react';
import { Menu, User } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="w-full h-16 bg-adspot-black border-b border-adspot-gray flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-adspot-black font-black text-lg">A</span>
          </div>
          <span>ADSPOT</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white transition-colors">
          <User size={24} />
        </button>
        <button 
          onClick={onMenuClick}
          className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-neutral-800 rounded"
        >
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
