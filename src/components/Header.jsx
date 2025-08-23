import React, { useState } from 'react';
import { User, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      {/* Main Header */}
      <header className="bg-gradient-to-r bg-[#0174B7]  px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <h1 className="text-xl text-white font-bold tracking-wide">RENT N RIDES</h1>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
{isMenuOpen && (
  <div className="md:hidden absolute top-full left-0 right-0 bg-[#0174b4] text-white shadow-lg z-50">
    <div className="px-4 py-6 flex flex-col items-center space-y-6">
      <nav className="flex flex-col items-center space-y-4 w-full">
        <a href="#" className="block hover:text-orange-300 transition-colors py-2 text-center w-full">Home</a>
        <a href="#" className="block hover:text-orange-300 transition-colors py-2 text-center w-full">Vehicles</a>
        <a href="#" className="block hover:text-orange-300 transition-colors py-2 text-center w-full">About</a>
        <a href="#" className="block hover:text-orange-300 transition-colors py-2 text-center w-full">Contact</a>
      </nav>

      <div className="pt-4 border-t border-white border-opacity-20 w-full">
        <button className="flex items-center justify-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 px-4 py-3 rounded-lg backdrop-blur-sm w-full">
          <User size={18} />
          <span className="font-medium text-black">Sign In</span>
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Header;