import React, { useState, useEffect } from 'react';
import { X, User, Mail, Send, Copy } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';
import { useDocuments } from '../../contexts/DocumentContext';
import { setPermission, getAccessControlList } from '../../lib/accessControl';
import { AccessControl, Permission } from '../../types';

const ShareModal: React.FC = () => {
  const { modal, closeModal, showNotification } = useUI();
  const { users, refreshData } = useDocuments();
  
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<Permission>('view');
  const [accessList, setAccessList] = useState<AccessControl[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (modal.type === 'share' && (modal.data?.document || modal.data?.folder)) {
      loadAccessList();
    }
  }, [modal]);
  
  const loadAccessList = async () => {
    setIsLoading(true);
    try {
      if (modal.data?.document) {
        const list = await getAccessControlList(modal.data.document.id, 'document');
        setAccessList(list);
      } else if (modal.data?.folder) {
        const list = await getAccessControlList(modal.data.folder.id, 'folder');
        setAccessList(list);
      }
    } catch (error) {
      console.error('Error loading access list:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShare = async () => {
    if (!email.trim()) {
      showNotification('Please enter an email address', 'error');
      return;
    }
    
    // Find user by email
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      showNotification('User not found', 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (modal.data?.document) {
        await setPermission({
          resourceId: modal.data.document.id,
          resourceType: 'document',
          userId: user.id,
          permission,
        });
      } else if (modal.data?.folder) {
        await setPermission({
          resourceId: modal.data.folder.id,
          resourceType: 'folder',
          userId: user.id,
          permission,
        });
      }
      
      loadAccessList();
      refreshData();
      setEmail('');
      showNotification(`Shared with ${user.name}`, 'success');
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, 'error');
      } else {
        showNotification('An error occurred', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyLink = () => {
    // In a real app, generate an actual sharing link
    navigator.clipboard.writeText(
      `https://yourdomain.com/share/${modal.data?.document ? modal.data.document.id : modal.data?.folder?.id}`
    );
    showNotification('Link copied to clipboard', 'success');
  };
  
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };
  
  const getUserEmail = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.email : '';
  };
  
  if (modal.type !== 'share') return null;
  
  const itemName = modal.data?.document 
    ? modal.data.document.name 
    : modal.data?.folder 
      ? modal.data.folder.name
      : 'Item';
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Share "{itemName}"</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={closeModal}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add people by email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={permission}
              onChange={(e) => setPermission(e.target.value as Permission)}
            >
              <option value="view">Viewer</option>
              <option value="edit">Editor</option>
              <option value="owner">Owner</option>
            </select>
            <button
              className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleShare}
              disabled={isLoading}
            >
              <Send size={18} />
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">People with access</h3>
            <ul className="space-y-2">
              {isLoading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : accessList.length === 0 ? (
                <p className="text-sm text-gray-500">No shared access</p>
              ) : (
                accessList.map((access, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                        <User size={16} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{getUserName(access.userId)}</p>
                        <p className="text-xs text-gray-500">{getUserEmail(access.userId)}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 capitalize">{access.permission}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Get link</h3>
            <div className="flex items-center">
              <div className="flex-1 px-3 py-2 bg-gray-100 rounded-l-md text-sm text-gray-600 truncate">
                Anyone with the link can view
              </div>
              <button 
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 transition-colors rounded-r-md"
                onClick={handleCopyLink}
              >
                <Copy size={16} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button 
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            onClick={closeModal}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;