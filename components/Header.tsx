import React from 'react';
import { Menu, User } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="w-full h-16 bg-adspot-black border-b border-adspot-gray flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {/* Replaced text logo with AD Logo */}
        <img
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAxMDAgNDAiPjx0ZXh0IHg9IjAiIHk9IjM1IiBmb250LWZhbWlseT0iQXJpYWwgQmxhY2ssIHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI5MDAiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiNGRjAwMDAiPkFEPC90ZXh0Pjwvc3ZnPg=="
          alt="AD Logo"
          className="h-10 w-auto object-contain"
        />
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
