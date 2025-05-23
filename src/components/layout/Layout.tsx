import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useUI } from '../../contexts/UIContext';
import UploadModal from '../modals/UploadModal';
import CreateFolderModal from '../modals/CreateFolderModal';
import ShareModal from '../modals/ShareModal';
import DeleteModal from '../modals/DeleteModal';
import FileDetailsModal from '../modals/FileDetailsModal';
import ContextMenu from '../ui/ContextMenu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSidebarOpen } = useUI();
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className={`flex-1 overflow-auto transition-all ${isSidebarOpen ? 'ml-0' : 'ml-0'}`}>
          {children}
        </main>
      </div>
      
      {/* Modals */}
      <UploadModal />
      <CreateFolderModal />
      <ShareModal />
      <DeleteModal />
      <FileDetailsModal />
      
      {/* Context Menu */}
      <ContextMenu />
    </div>
  );
};

export default Layout;