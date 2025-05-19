import { Document, Tag } from '../types';
import { documents, tags } from '../data/mockData';
import { v4 as uuidv4 } from '../utils/uuid';

interface CreateTagParams {
  name: string;
  color: string;
}

export const createTag = (params: CreateTagParams): Promise<Tag> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTag: Tag = {
        id: uuidv4(),
        name: params.name,
        color: params.color
      };

      tags.push(newTag);
      resolve(newTag);
    }, 300);
  });
};

export const updateTag = (id: string, params: Partial<Omit<Tag, 'id'>>): Promise<Tag> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = tags.findIndex(tag => tag.id === id);
      if (index === -1) {
        reject(new Error('Tag not found'));
        return;
      }

      const updatedTag = {
        ...tags[index],
        ...params
      };

      tags[index] = updatedTag;
      resolve(updatedTag);
    }, 300);
  });
};

export const deleteTag = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = tags.findIndex(tag => tag.id === id);
      if (index !== -1) {
        tags.splice(index, 1);
      }

      // Remove tag from all documents
      documents.forEach(doc => {
        const tagIndex = doc.tags.indexOf(id);
        if (tagIndex !== -1) {
          doc.tags.splice(tagIndex, 1);
        }
      });

      resolve();
    }, 300);
  });
};

export const addTagToDocument = (documentId: string, tagId: string): Promise<Document> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const docIndex = documents.findIndex(doc => doc.id === documentId);
      if (docIndex === -1) {
        reject(new Error('Document not found'));
        return;
      }

      const tagExists = tags.some(tag => tag.id === tagId);
      if (!tagExists) {
        reject(new Error('Tag not found'));
        return;
      }

      // Check if tag is already added
      if (!documents[docIndex].tags.includes(tagId)) {
        documents[docIndex].tags.push(tagId);
      }

      resolve(documents[docIndex]);
    }, 300);
  });
};

export const removeTagFromDocument = (documentId: string, tagId: string): Promise<Document> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const docIndex = documents.findIndex(doc => doc.id === documentId);
      if (docIndex === -1) {
        reject(new Error('Document not found'));
        return;
      }

      const tagIndex = documents[docIndex].tags.indexOf(tagId);
      if (tagIndex !== -1) {
        documents[docIndex].tags.splice(tagIndex, 1);
      }

      resolve(documents[docIndex]);
    }, 300);
  });
};

export const getDocumentsByTag = (tagId: string): Promise<Document[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = documents.filter(doc => doc.tags.includes(tagId));
      resolve(filtered);
    }, 300);
  });
};