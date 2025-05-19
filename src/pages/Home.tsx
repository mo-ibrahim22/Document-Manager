import React, { useState } from 'react';
import { useDocuments } from '../contexts/DocumentContext';
import { List, Grid, Plus, FolderPlus, ChevronDown, ArrowDownUp, ArrowUpDown } from 'lucide-react';
import FileCard from '../components/ui/FileCard';
import FolderCard from '../components/ui/FolderCard';
import FileList from '../components/ui/FileList';
import Breadcrumb from '../components/ui/Breadcrumb';
import { SortOption, SortDirection } from '../types';
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
      // Toggle direction if same option is selected
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOption(option);
      setSortDirection('asc');
    }
    setIsSortMenuOpen(false);
  };
  
  const { folders, documents } = folderContents;
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb folderPath={folderPath} />
        
        <div className="flex items-center">
          <div className="relative mr-2">
            <button 
              className="flex items-center px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            >
              {sortDirection === 'asc' ? <ArrowUpDown size={16} className="mr-1" /> : <ArrowDownUp size={16} className="mr-1" />}
              <span>
                {sortOption === 'name' ? 'Name' : sortOption === 'date' ? 'Last modified' : 'Size'}
              </span>
              <ChevronDown size={16} className="ml-1" />
            </button>
            
            {isSortMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
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
      
      <div className="flex items-center mb-4 space-x-2">
        <button
          className="flex items-center px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          onClick={() => openModal('upload')}
        >
          <Plus size={16} className="mr-1" />
          <span>Upload</span>
        </button>
        
        <button
          className="flex items-center px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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