import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';
import { createFolder } from '../../lib/folderManagement';
import { useDocuments } from '../../contexts/DocumentContext';

const CreateFolderModal: React.FC = () => {
  const { modal, closeModal, showNotification } = useUI();
  const { currentFolder, currentUser, refreshData } = useDocuments();
  
  const [folderName, setFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const handleCreate = async () => {
    if (!folderName.trim()) {
      showNotification('Please enter a folder name', 'error');
      return;
    }
    
    setIsCreating(true);
    
    try {
      await createFolder({
        name: folderName.trim(),
        parentId: currentFolder,
        createdBy: currentUser.id,
      });
      
      refreshData();
      showNotification('Folder created successfully', 'success');
      closeModal();
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, 'error');
      } else {
        showNotification('An error occurred while creating the folder', 'error');
      }
    } finally {
      setIsCreating(false);
    }
  };
  
  if (modal.type !== 'createFolder') return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Create Folder</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={closeModal}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div>
            <label 
              htmlFor="folderName" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Folder Name
            </label>
            <input
              type="text"
              id="folderName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
          <button 
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button 
            className={`px-4 py-2 text-sm text-white rounded-md transition-colors ${
              isCreating 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            onClick={handleCreate}
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;