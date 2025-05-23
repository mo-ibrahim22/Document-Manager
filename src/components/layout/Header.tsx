import React, { useState } from 'react';
import { Search, Menu, Settings, HelpCircle, Bell } from 'lucide-react';
import { useDocuments } from '../../contexts/DocumentContext';
import { useUI } from '../../contexts/UIContext';

const Header: React.FC = () => {
  const { searchQuery, setSearchQuery } = useDocuments();
  const { toggleSidebar, isSidebarOpen } = useUI();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  return (
    <header className="bg-white h-16 border-b border-gray-200 flex items-center px-2 sm:px-4 sticky top-0 z-10">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="mr-2 sm:mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#1a73e8]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.85 9L16.09 19H7.91L5.15 9H18.85Z" fill="currentColor"/>
            <path d="M12 4L14.5 9H9.5L12 4Z" fill="currentColor"/>
            <path d="M7 6.5L5.15 9L7.91 19H7V6.5Z" fill="currentColor" fillOpacity="0.4"/>
            <path d="M17 6.5V19H16.09L18.85 9L17 6.5Z" fill="currentColor" fillOpacity="0.4"/>
          </svg>
          <h1 className="text-lg sm:text-xl font-medium ml-2 text-gray-800 hidden xs:block">Drive</h1>
        </div>
      </div>
      
      <div className={`mx-2 sm:mx-auto max-w-2xl w-full relative transition-all ${
        isSearchFocused ? 'bg-white shadow-md' : 'bg-gray-100'
      } rounded-full flex items-center px-3 sm:px-4 py-2 md:max-w-lg`}>
        <Search size={18} className="text-gray-500 mr-2 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search in Drive"
          className="bg-transparent border-none outline-none w-full text-sm sm:text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
      </div>
      
      <div className="flex items-center ml-2 sm:ml-4">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors hidden sm:block">
          <HelpCircle size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors hidden sm:block">
          <Settings size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="ml-2 sm:ml-4 w-8 h-8 rounded-full overflow-hidden">
          <img 
            src="https://placehold.co/40/1a73e8/ffffff?text=MO" 
            alt="User avatar" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;