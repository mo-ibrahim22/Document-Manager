export type FileType = 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'txt' | 'csv' | 'image';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export type Permission = 'view' | 'edit' | 'owner';

export interface AccessControl {
  userId: string;
  permission: Permission;
}

export interface Document {
  id: string;
  name: string;
  type: FileType;
  size: number;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  description: string;
  starred: boolean;
  tags: string[];
  access: AccessControl[];
  thumbnail?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  access: AccessControl[];
}

export type ViewMode = 'grid' | 'list';

export type SortOption = 'name' | 'date' | 'size';

export type SortDirection = 'asc' | 'desc';