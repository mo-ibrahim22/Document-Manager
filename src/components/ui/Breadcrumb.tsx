import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Folder } from '../../types';
import { useDocuments } from '../../contexts/DocumentContext';

interface BreadcrumbProps {
  folderPath: Folder[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ folderPath }) => {
  const { setCurrentFolder } = useDocuments();
  
  return (
    <div className="flex items-center text-sm text-gray-600 mb-4 overflow-x-auto">
      <button 
        className="flex items-center hover:text-blue-600 transition-colors"
        onClick={() => setCurrentFolder(null)}
      >
        <Home size={16} className="mr-1" />
        <span>My Drive</span>
      </button>
      
      {folderPath.map((folder, index) => (
        <React.Fragment key={folder.id}>
          <ChevronRight size={16} className="mx-1 text-gray-400" />
          <button
            className={`hover:text-blue-600 transition-colors ${
              index === folderPath.length - 1 ? 'font-medium' : ''
            }`}
            onClick={() => setCurrentFolder(folder.id)}
          >
            {folder.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;