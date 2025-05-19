import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Document, Folder, Tag, ViewMode, SortOption, SortDirection, User } from '../types';
import { documents, folders, tags, currentUser, users } from '../data/mockData';
import { getFolderContents, getFolderPath } from '../lib/folderManagement';

interface DocumentContextType {
  // Current state
  currentFolder: string | null;
  folderPath: Folder[];
  folderContents: { folders: Folder[], documents: Document[] };
  currentUser: User;
  users: User[];
  isLoading: boolean;
  
  // View controls
  viewMode: ViewMode;
  sortOption: SortOption;
  sortDirection: SortDirection;
  searchQuery: string;
  
  // Data
  allDocuments: Document[];
  allFolders: Folder[];
  allTags: Tag[];
  
  // Actions
  setCurrentFolder: (folderId: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortOption: (option: SortOption) => void;
  setSortDirection: (direction: SortDirection) => void;
  setSearchQuery: (query: string) => void;
  refreshData: () => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<Folder[]>([]);
  const [folderContents, setFolderContents] = useState<{ folders: Folder[], documents: Document[] }>({
    folders: [],
    documents: []
  });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Wrapped data objects so we can refresh them
  const [allDocuments, setAllDocuments] = useState<Document[]>(documents);
  const [allFolders, setAllFolders] = useState<Folder[]>(folders);
  const [allTags, setAllTags] = useState<Tag[]>(tags);

  // Function to refresh data
  const refreshData = () => {
    setAllDocuments([...documents]);
    setAllFolders([...folders]);
    setAllTags([...tags]);
    loadFolderContents(currentFolder);
  };

  // Load folder contents when current folder changes
  const loadFolderContents = async (folderId: string | null) => {
    setIsLoading(true);
    try {
      const contents = await getFolderContents(folderId);
      const path = await getFolderPath(folderId);
      
      // Sort the contents based on current sort settings
      const sortedContents = {
        folders: sortItems(contents.folders, sortOption, sortDirection),
        documents: sortItems(contents.documents, sortOption, sortDirection)
      };
      
      setFolderContents(sortedContents);
      setFolderPath(path);
    } catch (error) {
      console.error('Error loading folder contents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sort items based on sort option and direction
  const sortItems = <T extends Folder | Document>(
    items: T[],
    option: SortOption,
    direction: SortDirection
  ): T[] => {
    return [...items].sort((a, b) => {
      let comparison = 0;
      
      switch (option) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'size':
          // Only applicable for documents
          if ('size' in a && 'size' in b) {
            comparison = (a.size as number) - (b.size as number);
          }
          break;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  };

  // Filter and sort the current folder contents whenever relevant state changes
  useEffect(() => {
    if (searchQuery) {
      // If searching, search across all documents and folders
      const filteredDocuments = allDocuments.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const filteredFolders = allFolders.filter(folder => 
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setFolderContents({
        documents: sortItems(filteredDocuments, sortOption, sortDirection),
        folders: sortItems(filteredFolders, sortOption, sortDirection)
      });
    } else {
      // If not searching, reload the current folder contents
      loadFolderContents(currentFolder);
    }
  }, [currentFolder, searchQuery, sortOption, sortDirection]);

  // Initial load
  useEffect(() => {
    loadFolderContents(null);
  }, []);

  const contextValue = useMemo(() => ({
    currentFolder,
    folderPath,
    folderContents,
    currentUser,
    users,
    isLoading,
    viewMode,
    sortOption,
    sortDirection,
    searchQuery,
    allDocuments,
    allFolders,
    allTags,
    setCurrentFolder,
    setViewMode,
    setSortOption,
    setSortDirection,
    setSearchQuery,
    refreshData
  }), [
    currentFolder,
    folderPath,
    folderContents,
    isLoading,
    viewMode,
    sortOption,
    sortDirection,
    searchQuery,
    allDocuments,
    allFolders,
    allTags
  ]);

  return (
    <DocumentContext.Provider value={contextValue}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};