import React, { createContext, useContext, useState } from 'react';
import { Document, Folder } from '../types';

interface ModalState {
  isOpen: boolean;
  type: 'upload' | 'createFolder' | 'fileDetails' | 'share' | 'delete' | 'none';
  data?: {
    document?: Document;
    folder?: Folder;
  };
}

interface ContextMenuState {
  isOpen: boolean;
  position: { x: number; y: number };
  item?: Document | Folder;
  itemType?: 'document' | 'folder';
}

interface UIContextType {
  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // Modal
  modal: ModalState;
  openModal: (type: ModalState['type'], data?: ModalState['data']) => void;
  closeModal: () => void;
  
  // Context Menu
  contextMenu: ContextMenuState;
  openContextMenu: (
    e: React.MouseEvent,
    item: Document | Folder,
    itemType: 'document' | 'folder'
  ) => void;
  closeContextMenu: () => void;
  
  // Notifications
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Modal state
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: 'none'
  });
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    position: { x: 0, y: 0 }
  });
  
  // Notification state
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    visible: boolean;
  }>({
    message: '',
    type: 'info',
    visible: false
  });
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  
  // Modal functions
  const openModal = (type: ModalState['type'], data?: ModalState['data']) => {
    setModal({
      isOpen: true,
      type,
      data
    });
  };
  
  const closeModal = () => {
    setModal({
      isOpen: false,
      type: 'none'
    });
  };
  
  // Context menu functions
  const openContextMenu = (
    e: React.MouseEvent,
    item: Document | Folder,
    itemType: 'document' | 'folder'
  ) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      item,
      itemType
    });
  };
  
  const closeContextMenu = () => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 }
    });
  };
  
  // Notification function
  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    setNotification({
      message,
      type,
      visible: true
    });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };
  
  // Context value
  const contextValue: UIContextType = {
    isSidebarOpen,
    toggleSidebar,
    modal,
    openModal,
    closeModal,
    contextMenu,
    openContextMenu,
    closeContextMenu,
    showNotification
  };
  
  return (
    <UIContext.Provider value={contextValue}>
      {children}
      {notification.visible && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg transition-opacity duration-300 ${
            notification.visible ? 'opacity-100' : 'opacity-0'
          } ${
            notification.type === 'success'
              ? 'bg-green-500 text-white'
              : notification.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-blue-500 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};