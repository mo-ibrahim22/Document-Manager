import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';
import FileUploadDrop from '../ui/FileUploadDrop';
import { uploadFile } from '../../lib/fileUpload';
import { useDocuments } from '../../contexts/DocumentContext';

const UploadModal: React.FC = () => {
  const { modal, closeModal, showNotification } = useUI();
  const { currentFolder, currentUser, refreshData, allTags } = useDocuments();
  
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const handleUpload = async () => {
    if (files.length === 0) {
      showNotification('Please select at least one file to upload', 'error');
      return;
    }
    
    if (!metadata.title.trim()) {
      // Use the filename if no title is provided
      setMetadata(prev => ({ 
        ...prev, 
        title: files[0].name 
      }));
    }
    
    setIsUploading(true);
    
    try {
      // In a real app we'd handle multiple files
      // For this example we'll just use the first file
      await uploadFile({
        file: files[0],
        name: metadata.title || files[0].name,
        description: metadata.description,
        folderId: currentFolder,
        tags: selectedTags,
        createdBy: currentUser.id,
      });
      
      refreshData();
      showNotification('File uploaded successfully', 'success');
      closeModal();
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, 'error');
      } else {
        showNotification('An error occurred while uploading', 'error');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      }
      return [...prev, tagId];
    });
  };
  
  if (modal.type !== 'upload') return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Upload File</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={closeModal}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <FileUploadDrop 
            onFilesSelected={setFiles}
          />
          
          <div className="mt-4 space-y-3">
            <div>
              <label 
                htmlFor="title" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={files.length > 0 ? files[0].name : "Document title"}
                value={metadata.title}
                onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <label 
                htmlFor="description" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description (optional)
              </label>
              <textarea
                id="description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a description"
                value={metadata.description}
                onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'bg-opacity-100'
                        : 'bg-opacity-20'
                    }`}
                    style={{ 
                      backgroundColor: selectedTags.includes(tag.id) ? tag.color : `${tag.color}33`,
                      color: tag.color
                    }}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <button
            className="text-gray-600 hover:text-gray-800 text-sm"
            onClick={() => closeModal()}
          >
            Create folder instead
          </button>
          
          <div className="flex space-x-2">
            <button 
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button 
              className={`px-4 py-2 text-sm text-white rounded-md transition-colors ${
                isUploading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;