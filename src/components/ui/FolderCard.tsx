import React from 'react';
import { Folder } from '../../types';
import { MoreVertical, FolderIcon } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';
import { useDocuments } from '../../contexts/DocumentContext';

interface FolderCardProps {
  folder: Folder;
}

const FolderCard: React.FC<FolderCardProps> = ({ folder }) => {
  const { openContextMenu, openModal } = useUI();
  const { setCurrentFolder } = useDocuments();
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e, folder, 'folder');
  };
  
  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal('fileDetails', { folder });
  };
  
  const handleFolderClick = () => {
    setCurrentFolder(folder.id);
  };
  
  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onContextMenu={handleContextMenu}
      onClick={handleFolderClick}
    >
      <div className="relative">
        <div className="w-full h-32 bg-gray-50 flex items-center justify-center">
          <FolderIcon size={64} className="text-[#1a73e8]" />
        </div>
      </div>
      
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div className="truncate pr-2">
            <h3 className="font-medium text-gray-800 truncate">{folder.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(folder.updatedAt).toLocaleDateString()}
            </p>
          </div>
          
          <button 
            className="p-1 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all"
            onClick={handleMoreClick}
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderCard;