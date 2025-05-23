import React from 'react';
import { 
  Star, 
  Clock, 
  Share, 
  Cloud, 
  Trash2, 
  Plus, 
  HardDrive 
} from 'lucide-react';
import { useDocuments } from '../../contexts/DocumentContext';
import { useUI } from '../../contexts/UIContext';

const Sidebar: React.FC = () => {
  const { currentFolder, setCurrentFolder } = useDocuments();
  const { isSidebarOpen, openModal } = useUI();
  
  const handleNewClick = () => {
    openModal('upload');
  };
  
  if (!isSidebarOpen) return null;
  
  return (
    <aside className="bg-white w-64 h-[calc(100vh-4rem)] border-r border-gray-200 flex flex-col transition-all">
      <div className="p-4">
        <button 
          onClick={handleNewClick}
          className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-full py-3 px-6 w-full font-medium shadow-sm transition-colors"
        >
          <Plus size={18} className="text-gray-700" />
          <span>New</span>
        </button>
      </div>
      
      <nav className="mt-2 flex-1 overflow-y-auto">
        <ul>
          <li>
            <button
              onClick={() => setCurrentFolder(null)}
              className={`flex items-center w-full px-6 py-3 text-sm ${
                currentFolder === null ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
              } transition-colors rounded-r-full`}
            >
              <HardDrive size={18} className={`mr-3 ${currentFolder === null ? 'text-blue-700' : 'text-gray-500'}`} />
              <span>My Drive</span>
            </button>
          </li>
          <li>
            <button
              className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-r-full"
            >
              <Share size={18} className="mr-3 text-gray-500" />
              <span>Shared with me</span>
            </button>
          </li>
          <li>
            <button
              className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-r-full"
            >
              <Star size={18} className="mr-3 text-gray-500" />
              <span>Starred</span>
            </button>
          </li>
          <li>
            <button
              className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-r-full"
            >
              <Clock size={18} className="mr-3 text-gray-500" />
              <span>Recent</span>
            </button>
          </li>
          <li>
            <button
              className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-r-full"
            >
              <Trash2 size={18} className="mr-3 text-gray-500" />
              <span>Trash</span>
            </button>
          </li>
        </ul>
        
        <div className="border-t border-gray-200 pt-4 mt-4">
          <ul>
            <li>
              <button
                className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-r-full"
              >
                <Cloud size={18} className="mr-3 text-gray-500" />
                <span>Storage</span>
              </button>
            </li>
          </ul>
          
          <div className="px-6 mt-2">
            <div className="bg-gray-100 rounded-full h-1.5 w-full">
              <div className="bg-blue-500 h-1.5 rounded-full w-1/3"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">3.4 GB of 15 GB used</p>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;