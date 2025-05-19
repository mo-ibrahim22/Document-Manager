import React from 'react';
import { Document } from '../../types';
import { Star, MoreVertical } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';
import { starFile } from '../../lib/fileUpload';
import { useDocuments } from '../../contexts/DocumentContext';
import { formatFileSize } from '../../lib/fileValidation';

interface FileCardProps {
  document: Document;
}

const FileCard: React.FC<FileCardProps> = ({ document }) => {
  const { openContextMenu, openModal } = useUI();
  const { refreshData } = useDocuments();
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e, document, 'document');
  };
  
  const handleOpenDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal('fileDetails', { document });
  };
  
  const handleStarToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await starFile(document.id, !document.starred);
    refreshData();
  };
  
  const handleCardClick = () => {
    openModal('fileDetails', { document });
  };
  
  const getIconForFileType = (type: string) => {
    const iconMap: Record<string, string> = {
      pdf: '📕',
      doc: '📘',
      docx: '📘',
      xls: '📗',
      xlsx: '📗',
      ppt: '📙',
      pptx: '📙',
      txt: '📃',
      csv: '📊',
      image: '🖼️'
    };
    
    return iconMap[type] || '📄';
  };
  
  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onContextMenu={handleContextMenu}
      onClick={handleCardClick}
    >
      <div className="relative">
        {document.type === 'image' ? (
          <img 
            src={document.thumbnail} 
            alt={document.name} 
            className="w-full h-32 object-cover"
          />
        ) : (
          <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
            <span className="text-4xl">{getIconForFileType(document.type)}</span>
          </div>
        )}
        
        <button 
          className={`absolute top-2 right-2 p-1 rounded-full ${
            document.starred ? 'text-yellow-500' : 'text-gray-400 opacity-0 group-hover:opacity-100'
          } hover:bg-gray-200 transition-all`}
          onClick={handleStarToggle}
        >
          <Star size={16} fill={document.starred ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div className="truncate pr-2">
            <h3 className="font-medium text-gray-800 truncate">{document.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {formatFileSize(document.size)} • {new Date(document.updatedAt).toLocaleDateString()}
            </p>
          </div>
          
          <button 
            className="p-1 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all"
            onClick={handleOpenDetails}
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileCard;