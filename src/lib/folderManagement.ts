import { Folder } from '../types';
import { folders, documents } from '../data/mockData';
import { v4 as uuidv4 } from '../utils/uuid';

interface CreateFolderParams {
  name: string;
  parentId: string | null;
  createdBy: string;
}

interface UpdateFolderParams {
  id: string;
  name?: string;
  parentId?: string | null;
}

export const createFolder = (params: CreateFolderParams): Promise<Folder> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newFolder: Folder = {
        id: uuidv4(),
        name: params.name,
        parentId: params.parentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: params.createdBy,
        access: [{ userId: params.createdBy, permission: 'owner' }]
      };

      folders.push(newFolder);
      resolve(newFolder);
    }, 500);
  });
};

export const updateFolder = (params: UpdateFolderParams): Promise<Folder> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = folders.findIndex(folder => folder.id === params.id);
      if (index === -1) {
        reject(new Error('Folder not found'));
        return;
      }

      // Update folder with new values
      const updatedFolder = {
        ...folders[index],
        ...(params.name && { name: params.name }),
        ...(params.parentId !== undefined && { parentId: params.parentId }),
        updatedAt: new Date().toISOString()
      };

      folders[index] = updatedFolder;
      resolve(updatedFolder);
    }, 500);
  });
};

export const deleteFolder = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if folder exists
      const folderIndex = folders.findIndex(folder => folder.id === id);
      if (folderIndex === -1) {
        reject(new Error('Folder not found'));
        return;
      }

      // Check for subfolders
      const hasSubfolders = folders.some(folder => folder.parentId === id);
      if (hasSubfolders) {
        reject(new Error('Cannot delete folder with subfolders'));
        return;
      }

      // Check for documents in folder
      const hasDocuments = documents.some(doc => doc.folderId === id);
      if (hasDocuments) {
        reject(new Error('Cannot delete folder with documents'));
        return;
      }

      // Remove folder
      folders.splice(folderIndex, 1);
      resolve();
    }, 500);
  });
};

export const getFolderContents = (folderId: string | null): Promise<{ folders: Folder[], documents: Document[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const folderContents = folders.filter(folder => folder.parentId === folderId);
      const documentContents = documents.filter(doc => doc.folderId === folderId);

      resolve({
        folders: folderContents,
        documents: documentContents
      });
    }, 300);
  });
};

export const getFolderPath = (folderId: string | null): Promise<Folder[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const path: Folder[] = [];
      
      if (!folderId) {
        resolve(path);
        return;
      }

      let currentFolder = folders.find(folder => folder.id === folderId);
      
      while (currentFolder) {
        path.unshift(currentFolder);
        
        if (!currentFolder.parentId) {
          break;
        }
        
        currentFolder = folders.find(folder => folder.id === currentFolder?.parentId);
      }

      resolve(path);
    }, 300);
  });
};