import React, { useEffect } from 'react';
import { useUI } from '../../contexts/UIContext';
import { 
  Download, 
  Trash2, 
  Share2, 
  Star, 
  Edit, 
  Scissors, 
  Copy,
  Eye
} from 'lucide-react';
import { starFile, deleteFile } from '../../lib/fileUpload';
import { deleteFolder } from '../../lib/folderManagement';
import { useDocuments } from '../../contexts/DocumentContext';

const ContextMenu: React.FC = () => {
  const { contextMenu, closeContextMenu, openModal, showNotification } = useUI();
  const { refreshData } = useDocuments();
  
  useEffect(() => {
    const handleClick = () => {
      closeContextMenu();
    };
    
    if (contextMenu.isOpen) {
      document.addEventListener('click', handleClick);
    }
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [contextMenu.isOpen, closeContextMenu]);
  
  if (!contextMenu.isOpen || !contextMenu.item) return null;
  
  const handleDelete = async () => {
    try {
      if (contextMenu.itemType === 'document' && contextMenu.item) {
        await deleteFile(contextMenu.item.id);
        showNotification('File deleted successfully', 'success');
      } else if (contextMenu.itemType === 'folder' && contextMenu.item) {
        await deleteFolder(contextMenu.item.id);
        showNotification('Folder deleted successfully', 'success');
      }
      refreshData();
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, 'error');
      } else {
        showNotification('An error occurred', 'error');
      }
    }
    closeContextMenu();
  };
  
  const handleStar = async () => {
    if (contextMenu.itemType === 'document' && contextMenu.item) {
      await starFile(contextMenu.item.id, !contextMenu.item.starred);
      refreshData();
    }
    closeContextMenu();
  };
  
  const handleShare = () => {
    if (contextMenu.item) {
      openModal('share', { 
        ...(contextMenu.itemType === 'document' && { document: contextMenu.item }),
        ...(contextMenu.itemType === 'folder' && { folder: contextMenu.item }),
      });
    }
    closeContextMenu();
  };
  
  const style = {
    top: `${contextMenu.position.y}px`,
    left: `${contextMenu.position.x}px`,
  };
  
  return (
    <div 
      className="fixed z-50 bg-white rounded-md shadow-lg border border-gray-200 py-2 w-56 text-gray-700"
      style={style}
    >
      <div className="px-4 py-2 text-sm font-medium text-gray-600 truncate max-w-full">
        {contextMenu.item.name}
      </div>
      
      <div className="w-full h-px bg-gray-200 my-1"></div>
      
      <ul>
        <li>
          <button 
            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors"
            onClick={() => {
              if (contextMenu.itemType === 'document') {
                openModal('fileDetails', { document: contextMenu.item });
              } else {
                openModal('fileDetails', { folder: contextMenu.item });
              }
              closeContextMenu();
            }}
          >
            <Eye size={16} className="mr-3 text-gray-500" />
            <span>Open</span>
          </button>
        </li>
        
        {contextMenu.itemType === 'document' && (
          <li>
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors"
            >
              <Download size={16} className="mr-3 text-gray-500" />
              <span>Download</span>
            </button>
          </li>
        )}
        
        <li>
          <button 
            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors"
            onClick={handleShare}
          >
            <Share2 size={16} className="mr-3 text-gray-500" />
            <span>Share</span>
          </button>
        </li>
        
        {contextMenu.itemType === 'document' && (
          <li>
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors"
              onClick={handleStar}
            >
              <Star 
                size={16} 
                className="mr-3" 
                fill={contextMenu.item.starred ? 'currentColor' : 'none'}
                color={contextMenu.item.starred ? '#f59e0b' : '#6b7280'}
              />
              <span>{contextMenu.item.starred ? 'Remove star' : 'Add star'}</span>
            </button>
          </li>
        )}
        
        <div className="w-full h-px bg-gray-200 my-1"></div>
        
        <li>
          <button 
            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors"
          >
            <Edit size={16} className="mr-3 text-gray-500" />
            <span>Rename</span>
          </button>
        </li>
        
        <li>
          <button 
            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors"
          >
            <Copy size={16} className="mr-3 text-gray-500" />
            <span>Make a copy</span>
          </button>
        </li>
        
        <li>
          <button 
            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors"
          >
            <Scissors size={16} className="mr-3 text-gray-500" />
            <span>Move to</span>
          </button>
        </li>
        
        <div className="w-full h-px bg-gray-200 my-1"></div>
        
        <li>
          <button 
            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors text-red-600"
            onClick={handleDelete}
          >
            <Trash2 size={16} className="mr-3 text-red-500" />
            <span>Remove</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ContextMenu;