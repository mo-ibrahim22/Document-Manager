import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Document, Folder, Tag, ViewMode, SortOption, SortDirection, User } from '../types/'
import { documents, folders, tags, currentUser, users } from '../data/mockData';
import { getFolderContents, getFolderPath } from '../lib/folderManagement';


interface DocumentContextType {
  currentFolder: string | null;
  folderPath: Folder[];
  folderContents: { folders: Folder[], documents: Document[] };
  currentUser: User;
  users: User[];
  isLoading: boolean;
  viewMode: ViewMode;
  sortOption: SortOption;
  sortDirection: SortDirection;
  searchQuery: string;
  allDocuments: Document[];
  allFolders: Folder[];
  allTags: Tag[];
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

  const [allDocuments, setAllDocuments] = useState<Document[]>(documents);
  const [allFolders, setAllFolders] = useState<Folder[]>(folders);
  const [allTags, setAllTags] = useState<Tag[]>(tags);
  const [currentUserState] = useState<User>(currentUser);
  const [usersState] = useState<User[]>(users);

  const refreshData = () => {
    setAllDocuments([...documents]);
    setAllFolders([...folders]);
    setAllTags([...tags]);
    loadFolderContents(currentFolder);
  };

  const loadFolderContents = async (folderId: string | null) => {
    setIsLoading(true);
    try {
      const contents = await getFolderContents(folderId);
      const path = await getFolderPath(folderId);

      const sortedContents = {
        folders: sortItems<Folder>(contents.folders as Folder[], sortOption, sortDirection),
        documents: sortItems<Document>(contents.documents as unknown as Document[], sortOption, sortDirection)
      };

      setFolderContents(sortedContents);
      setFolderPath(path);
    } catch (error) {
      console.error('Error loading folder contents:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
          if ('size' in a && 'size' in b) {
            comparison = (a.size as number) - (b.size as number);
          }
          break;
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  };

  useEffect(() => {
    if (searchQuery) {
      const filteredDocuments = allDocuments.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const filteredFolders = allFolders.filter(folder =>
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFolderContents({
        documents: sortItems<Document>(filteredDocuments, sortOption, sortDirection),
        folders: sortItems<Folder>(filteredFolders, sortOption, sortDirection)
      });
    } else {
      loadFolderContents(currentFolder);
    }
  }, [currentFolder, searchQuery, sortOption, sortDirection]);

  useEffect(() => {
    loadFolderContents(null);
  }, []);

  const contextValue = useMemo(() => ({
    currentFolder,
    folderPath,
    folderContents,
    currentUser: currentUserState,
    users: usersState,
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
    allTags,
    currentUserState,
    usersState
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
