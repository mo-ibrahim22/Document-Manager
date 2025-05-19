import React, { useState } from 'react';
import { X, Download, Share2, Star, Trash2, Edit, Calendar, Tag, Info, User } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';
import { Document, Folder, Tag as TagType } from '../../types';
import { formatFileSize } from '../../lib/fileValidation';
import { useDocuments } from '../../contexts/DocumentContext';
import { starFile, updateFile } from '../../lib/fileUpload';
import { updateFolder } from '../../lib/folderManagement';
import { addTagToDocument, removeTagFromDocument } from '../../lib/tagging';

const FileDetailsModal: React.FC = () => {
  const { modal, closeModal, showNotification, openModal } = useUI();
  const { refreshData, allTags, users } = useDocuments();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const document = modal.data?.document as Document | undefined;
  const folder = modal.data?.folder as Folder | undefined;
  
  React.useEffect(() => {
    if (document) {
      setFormData({
        name: document.name,
        description: document.description
      });
      setSelectedTags(document.tags);
    } else if (folder) {
      setFormData({
        name: folder.name,
        description: ''
      });
      setSelectedTags([]);
    }
  }, [document, folder]);
  
  const handleDelete = () => {
    openModal('delete', modal.data);
  };
  
  const handleShare = () => {
    openModal('share', modal.data);
  };
  
  const handleStarToggle = async () => {
    if (document) {
      await starFile(document.id, !document.starred);
      refreshData();
    }
  };
  
  const handleSave = async () => {
    try {
      if (document) {
        await updateFile({
          id: document.id,
          name: formData.name,
          description: formData.description
        });
        
        // Update tags
        const addTags = selectedTags.filter(tag => !document.tags.includes(tag));
        const removeTags = document.tags.filter(tag => !selectedTags.includes(tag));
        
        for (const tagId of addTags) {
          await addTagToDocument(document.id, tagId);
        }
        
        for (const tagId of removeTags) {
          await removeTagFromDocument(document.id, tagId);
        }
      } else if (folder) {
        await updateFolder({
          id: folder.id,
          name: formData.name
        });
      }
      
      setIsEditing(false);
      refreshData();
      showNotification('Changes saved successfully', 'success');
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, 'error');
      } else {
        showNotification('An error occurred', 'error');
      }
    }
  };
  
  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };
  
  const getTagById = (tagId: string): TagType | undefined => {
    return allTags.find(tag => tag.id === tagId);
  };
  
  const getOwnerName = (ownerId: string): string => {
    const owner = users.find(user => user.id === ownerId);
    return owner ? owner.name : 'Unknown';
  };
  
  if (modal.type !== 'fileDetails') return null;
  
  if (!document && !folder) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">
            {isEditing ? 'Edit Details' : 'File Details'}
          </h2>
          <button 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={closeModal}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {document && (
            <div className="mb-6">
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                {document.type === 'image' ? (
                  <img 
                    src={document.thumbnail} 
                    alt={document.name} 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-6xl">
                    {document.type === 'pdf' && '📕'}
                    {(document.type === 'doc' || document.type === 'docx') && '📘'}
                    {(document.type === 'xls' || document.type === 'xlsx') && '📗'}
                    {(document.type === 'ppt' || document.type === 'pptx') && '📙'}
                    {document.type === 'txt' && '📃'}
                    {document.type === 'csv' && '📊'}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              {document && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  ></textarea>
                </div>
              )}
              
              {document && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag.id}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedTags.includes(tag.id)
                            ? 'bg-opacity-100'
                            : 'bg-opacity-20'
                        }`}
                        style={{ backgroundColor: selectedTags.includes(tag.id) ? tag.color : `${tag.color}33`, color: tag.color }}
                        onClick={() => handleTagToggle(tag.id)}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  {document ? document.name : folder?.name}
                </h3>
                
                {document && document.description && (
                  <p className="text-gray-600 mb-4">{document.description}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Calendar size={16} className="text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="text-sm text-gray-700">
                      {new Date(document ? document.createdAt : folder!.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar size={16} className="text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Modified</p>
                    <p className="text-sm text-gray-700">
                      {new Date(document ? document.updatedAt : folder!.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {document && (
                  <div className="flex items-start">
                    <Info size={16} className="text-gray-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Size</p>
                      <p className="text-sm text-gray-700">{formatFileSize(document.size)}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <User size={16} className="text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Owner</p>
                    <p className="text-sm text-gray-700">
                      {getOwnerName(document ? document.createdBy : folder!.createdBy)}
                    </p>
                  </div>
                </div>
              </div>
              
              {document && document.tags.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-start mb-2">
                    <Tag size={16} className="text-gray-500 mt-0.5 mr-2" />
                    <p className="text-xs text-gray-500">Tags</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 ml-6">
                    {document.tags.map(tagId => {
                      const tag = getTagById(tagId);
                      return tag ? (
                        <span
                          key={tag.id}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: tag.color, color: 'white' }}
                        >
                          {tag.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-between">
          {isEditing ? (
            <>
              <button 
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <div className="flex space-x-2">
                <button 
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={handleDelete}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
                
                {document && (
                  <button 
                    className={`p-2 rounded-full transition-colors ${
                      document.starred 
                        ? 'text-yellow-500 hover:text-yellow-600' 
                        : 'text-gray-600 hover:text-yellow-500'
                    } hover:bg-gray-100`}
                    onClick={handleStarToggle}
                    title={document.starred ? "Remove star" : "Add star"}
                  >
                    <Star size={18} fill={document.starred ? 'currentColor' : 'none'} />
                  </button>
                )}
                
                <button 
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={handleShare}
                  title="Share"
                >
                  <Share2 size={18} />
                </button>
                
                {document && (
                  <button 
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Download"
                  >
                    <Download size={18} />
                  </button>
                )}
              </div>
              
              <button 
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
                onClick={() => setIsEditing(true)}
              >
                <Edit size={16} className="mr-1" />
                <span>Edit</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileDetailsModal;