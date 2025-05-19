import React from 'react';
import { Document, Folder } from '../../types';
import { useDocuments } from '../../contexts/DocumentContext';
import { formatFileSize } from '../../lib/fileValidation';
import { Star, FileIcon, FolderIcon, MoreVertical } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';
import { starFile } from '../../lib/fileUpload';

interface FileListProps {
  documents: Document[];
  folders: Folder[];
}

const FileList: React.FC<FileListProps> = ({ documents, folders }) => {
  const { refreshData, setCurrentFolder } = useDocuments();
  const { openContextMenu, openModal } = useUI();
  
  const handleStarToggle = async (e: React.MouseEvent, document: Document) => {
    e.stopPropagation();
    await starFile(document.id, !document.starred);
    refreshData();
  };
  
  const handleDocumentClick = (document: Document) => {
    openModal('fileDetails', { document });
  };
  
  const handleFolderClick = (folder: Folder) => {
    setCurrentFolder(folder.id);
  };
  
  const handleDocumentContextMenu = (e: React.MouseEvent, document: Document) => {
    e.preventDefault();
    openContextMenu(e, document, 'document');
  };
  
  const handleFolderContextMenu = (e: React.MouseEvent, folder: Folder) => {
    e.preventDefault();
    openContextMenu(e, folder, 'folder');
  };
  
  return (
    <div className="w-full">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Name</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modified</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
            <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-gray-200">
          {folders.map(folder => (
            <tr 
              key={folder.id} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => handleFolderClick(folder)}
              onContextMenu={(e) => handleFolderContextMenu(e, folder)}
            >
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <FolderIcon size={20} className="text-[#1a73e8] mr-3" />
                  <span className="font-medium text-gray-800">{folder.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {new Date(folder.updatedAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                --
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right">
                <button 
                  className="p-1 rounded-full text-gray-400 hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal('fileDetails', { folder });
                  }}
                >
                  <MoreVertical size={16} />
                </button>
              </td>
            </tr>
          ))}
          
          {documents.map(document => (
            <tr 
              key={document.id} 
              className="hover:bg-gray-50 cursor-pointer group"
              onClick={() => handleDocumentClick(document)}
              onContextMenu={(e) => handleDocumentContextMenu(e, document)}
            >
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <FileIcon size={20} className="text-gray-500 mr-3" />
                  <span className="text-gray-800">{document.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {new Date(document.updatedAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {formatFileSize(document.size)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right">
                <div className="flex items-center justify-end space-x-2">
                  <button 
                    className={`p-1 rounded-full ${
                      document.starred ? 'text-yellow-500' : 'text-gray-400 opacity-0 group-hover:opacity-100'
                    } hover:bg-gray-100 transition-all`}
                    onClick={(e) => handleStarToggle(e, document)}
                  >
                    <Star size={16} fill={document.starred ? 'currentColor' : 'none'} />
                  </button>
                  
                  <button 
                    className="p-1 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal('fileDetails', { document });
                    }}
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          
          {folders.length === 0 && documents.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                No files or folders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;