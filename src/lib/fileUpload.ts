import { Document, FileType } from '../types';
import { documents } from '../data/mockData';
import { validateFile } from './fileValidation';
import { v4 as uuidv4 } from '../utils/uuid';

interface UploadFileParams {
  file: File;
  name: string;
  folderId: string | null;
  description: string;
  tags: string[];
  createdBy: string;
}

interface UpdateFileParams {
  id: string;
  name?: string;
  description?: string;
  folderId?: string | null;
  tags?: string[];
}

export const uploadFile = (params: UploadFileParams): Promise<Document> => {
  return new Promise((resolve, reject) => {
    // Simulate backend processing
    setTimeout(() => {
      // Validate file
      const validation = validateFile(params.file);
      if (!validation.valid) {
        reject(new Error(validation.message));
        return;
      }

      // Extract file extension to determine type
      const fileExtension = params.file.name.split('.').pop()?.toLowerCase() as FileType;
      
      // Create new document
      const newDocument: Document = {
        id: uuidv4(),
        name: params.name,
        type: fileExtension,
        size: params.file.size,
        folderId: params.folderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: params.createdBy,
        description: params.description,
        starred: false,
        tags: params.tags,
        access: [{ userId: params.createdBy, permission: 'owner' }],
        thumbnail: generateThumbnail(fileExtension)
      };

      // Add to documents array (in a real app, this would be a DB operation)
      documents.push(newDocument);
      resolve(newDocument);
    }, 1000); // Simulating network delay
  });
};

export const updateFile = (params: UpdateFileParams): Promise<Document> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = documents.findIndex(doc => doc.id === params.id);
      if (index === -1) {
        reject(new Error('Document not found'));
        return;
      }

      // Update document with new values
      const updatedDocument = {
        ...documents[index],
        ...(params.name && { name: params.name }),
        ...(params.description && { description: params.description }),
        ...(params.folderId !== undefined && { folderId: params.folderId }),
        ...(params.tags && { tags: params.tags }),
        updatedAt: new Date().toISOString()
      };

      documents[index] = updatedDocument;
      resolve(updatedDocument);
    }, 500);
  });
};

export const deleteFile = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = documents.findIndex(doc => doc.id === id);
      if (index === -1) {
        reject(new Error('Document not found'));
        return;
      }

      documents.splice(index, 1);
      resolve();
    }, 500);
  });
};

export const starFile = (id: string, starred: boolean): Promise<Document> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = documents.findIndex(doc => doc.id === id);
      if (index === -1) {
        reject(new Error('Document not found'));
        return;
      }

      documents[index] = {
        ...documents[index],
        starred,
        updatedAt: new Date().toISOString()
      };

      resolve(documents[index]);
    }, 300);
  });
};

const generateThumbnail = (fileType: FileType): string => {
  // In a real app, this would generate actual thumbnails
  // Here we're just returning placeholder images
  switch (fileType) {
    case 'pdf':
      return 'https://placehold.co/400x300/e2e8f0/1e3a8a?text=PDF';
    case 'doc':
    case 'docx':
      return 'https://placehold.co/400x300/e2e8f0/1e3a8a?text=DOCX';
    case 'xls':
    case 'xlsx':
      return 'https://placehold.co/400x300/e2e8f0/1e3a8a?text=XLSX';
    case 'ppt':
    case 'pptx':
      return 'https://placehold.co/400x300/e2e8f0/1e3a8a?text=PPTX';
    case 'txt':
    case 'csv':
      return 'https://placehold.co/400x300/e2e8f0/1e3a8a?text=TXT';
    case 'image':
      return 'https://placehold.co/400x300/e2e8f0/1e3a8a?text=IMG';
    default:
      return 'https://placehold.co/400x300/e2e8f0/1e3a8a?text=FILE';
  }
};