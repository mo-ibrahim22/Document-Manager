import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';
import { deleteFile } from '../../lib/fileUpload';
import { deleteFolder } from '../../lib/folderManagement';
import { useDocuments } from '../../contexts/DocumentContext';

const DeleteModal: React.FC = () => {
  const { modal, closeModal, showNotification } = useUI();
  const { refreshData } = useDocuments();
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      if (modal.data?.document) {
        await deleteFile(modal.data.document.id);
        showNotification('File deleted successfully', 'success');
      } else if (modal.data?.folder) {
        await deleteFolder(modal.data.folder.id);
        showNotification('Folder deleted successfully', 'success');
      }
      
      refreshData();
      closeModal();
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, 'error');
      } else {
        showNotification('An error occurred', 'error');
      }
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (modal.type !== 'delete') return null;
  
  const itemName = modal.data?.document 
    ? modal.data.document.name 
    : modal.data?.folder 
      ? modal.data.folder.name 
      : 'this item';
  
  const itemType = modal.data?.document ? 'file' : 'folder';
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Confirm Deletion</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={closeModal}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center text-amber-600 mb-4">
            <AlertTriangle size={24} className="mr-2" />
            <span className="font-medium">Warning</span>
          </div>
          
          <p className="text-gray-700">
            Are you sure you want to delete the {itemType} <span className="font-medium">"{itemName}"</span>?
          </p>
          
          <p className="text-gray-700 mt-2">
            This action cannot be undone.
          </p>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
          <button 
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button 
            className={`px-4 py-2 text-sm text-white bg-red-600 rounded-md transition-colors ${
              isDeleting ? 'bg-red-400 cursor-not-allowed' : 'hover:bg-red-700'
            }`}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;