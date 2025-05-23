import React, { useState } from 'react';
import { useDocuments } from '../contexts/DocumentContext';
import { List, Grid, Plus, FolderPlus, ChevronDown, ArrowDownUp, ArrowUpDown } from 'lucide-react';
import FileCard from '../components/ui/FileCard';
import FolderCard from '../components/ui/FolderCard';
import FileList from '../components/ui/FileList';
import Breadcrumb from '../components/ui/Breadcrumb';
import { SortOption } from '../types';
import { useUI } from '../contexts/UIContext';

const Home: React.FC = () => {
  const { 
    folderContents, 
    folderPath, 
    viewMode, 
    setViewMode, 
    sortOption,
    setSortOption,
    sortDirection,
    setSortDirection,
    isLoading
  } = useDocuments();
  
  const { openModal } = useUI();
  
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  
  const handleSortChange = (option: SortOption) => {
    if (sortOption === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOption(option);
      setSortDirection('asc');
    }
    setIsSortMenuOpen(false);
  };
  
  const { folders, documents } = folderContents;
  
  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <Breadcrumb folderPath={folderPath} />
        
        <div className="flex items-center">
          <div className="relative mr-2">
            <button 
              className="flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors min-w-[90px]"
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            >
              {sortDirection === 'asc' ? <ArrowUpDown size={16} className="mr-1" /> : <ArrowDownUp size={16} className="mr-1" />}
              <span className="truncate">
                {sortOption === 'name' ? 'Name' : sortOption === 'date' ? 'Modified' : 'Size'}
              </span>
              <ChevronDown size={16} className="ml-1 flex-shrink-0" />
            </button>
            
            {isSortMenuOpen && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <ul className="py-1">
                  <li>
                    <button 
                      className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                        sortOption === 'name' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleSortChange('name')}
                    >
                      Name
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                        sortOption === 'date' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleSortChange('date')}
                    >
                      Last modified
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                        sortOption === 'size' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleSortChange('size')}
                    >
                      Size
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <button 
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' 
                ? 'bg-gray-100 text-gray-800' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={20} />
          </button>
          <button 
            className={`p-2 rounded-md ml-1 transition-colors ${
              viewMode === 'list' 
                ? 'bg-gray-100 text-gray-800' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setViewMode('list')}
          >
            <List size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col xs:flex-row items-stretch xs:items-center mb-4 space-y-2 xs:space-y-0 xs:space-x-2">
        <button
          className="flex items-center justify-center px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          onClick={() => openModal('upload')}
        >
          <Plus size={16} className="mr-1" />
          <span>Upload</span>
        </button>
        
        <button
          className="flex items-center justify-center px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          onClick={() => openModal('createFolder')}
        >
          <FolderPlus size={16} className="mr-1" />
          <span>New folder</span>
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {folders.map(folder => (
              <FolderCard key={folder.id} folder={folder} />
            ))}
            
            {documents.map(document => (
              <FileCard key={document.id} document={document} />
            ))}
            
            {folders.length === 0 && documents.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No files or folders found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <FileList folders={folders} documents={documents} />
          </div>
        )
      )}
    </div>
  );
};

export default Home;