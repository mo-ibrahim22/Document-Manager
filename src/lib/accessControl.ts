import { Document, Folder, Permission, AccessControl } from '../types';
import { documents, folders } from '../data/mockData';

interface SetPermissionParams {
  resourceId: string;
  resourceType: 'document' | 'folder';
  userId: string;
  permission: Permission;
}

export const setPermission = (params: SetPermissionParams): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { resourceId, resourceType, userId, permission } = params;
      
      if (resourceType === 'document') {
        const docIndex = documents.findIndex(doc => doc.id === resourceId);
        if (docIndex === -1) {
          reject(new Error('Document not found'));
          return;
        }

        // Check if user already has a permission
        const accessIndex = documents[docIndex].access.findIndex(
          access => access.userId === userId
        );

        if (accessIndex !== -1) {
          // Update existing permission
          documents[docIndex].access[accessIndex].permission = permission;
        } else {
          // Add new permission
          documents[docIndex].access.push({ userId, permission });
        }
      } else if (resourceType === 'folder') {
        const folderIndex = folders.findIndex(folder => folder.id === resourceId);
        if (folderIndex === -1) {
          reject(new Error('Folder not found'));
          return;
        }

        // Check if user already has a permission
        const accessIndex = folders[folderIndex].access.findIndex(
          access => access.userId === userId
        );

        if (accessIndex !== -1) {
          // Update existing permission
          folders[folderIndex].access[accessIndex].permission = permission;
        } else {
          // Add new permission
          folders[folderIndex].access.push({ userId, permission });
        }
      }

      resolve();
    }, 500);
  });
};

export const removePermission = (
  resourceId: string,
  resourceType: 'document' | 'folder',
  userId: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (resourceType === 'document') {
        const docIndex = documents.findIndex(doc => doc.id === resourceId);
        if (docIndex === -1) {
          reject(new Error('Document not found'));
          return;
        }

        // Filter out the permission for this user
        documents[docIndex].access = documents[docIndex].access.filter(
          access => access.userId !== userId
        );
      } else if (resourceType === 'folder') {
        const folderIndex = folders.findIndex(folder => folder.id === resourceId);
        if (folderIndex === -1) {
          reject(new Error('Folder not found'));
          return;
        }

        // Filter out the permission for this user
        folders[folderIndex].access = folders[folderIndex].access.filter(
          access => access.userId !== userId
        );
      }

      resolve();
    }, 500);
  });
};

export const getAccessControlList = (
  resourceId: string,
  resourceType: 'document' | 'folder'
): Promise<AccessControl[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (resourceType === 'document') {
        const doc = documents.find(doc => doc.id === resourceId);
        if (!doc) {
          reject(new Error('Document not found'));
          return;
        }
        resolve(doc.access);
      } else if (resourceType === 'folder') {
        const folder = folders.find(folder => folder.id === resourceId);
        if (!folder) {
          reject(new Error('Folder not found'));
          return;
        }
        resolve(folder.access);
      }
    }, 300);
  });
};

export const hasPermission = (
  resourceId: string,
  resourceType: 'document' | 'folder',
  userId: string,
  requiredPermission: Permission
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let resource: Document | Folder | undefined;
      
      if (resourceType === 'document') {
        resource = documents.find(doc => doc.id === resourceId);
      } else {
        resource = folders.find(folder => folder.id === resourceId);
      }

      if (!resource) {
        resolve(false);
        return;
      }

      const userAccess = resource.access.find(access => access.userId === userId);
      
      if (!userAccess) {
        resolve(false);
        return;
      }

      // Owner can do anything
      if (userAccess.permission === 'owner') {
        resolve(true);
        return;
      }

      // Editor can view and edit
      if (userAccess.permission === 'edit' && 
          (requiredPermission === 'view' || requiredPermission === 'edit')) {
        resolve(true);
        return;
      }

      // Viewer can only view
      if (userAccess.permission === 'view' && requiredPermission === 'view') {
        resolve(true);
        return;
      }

      resolve(false);
    }, 300);
  });
};