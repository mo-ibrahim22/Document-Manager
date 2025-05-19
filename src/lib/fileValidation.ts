interface ValidationResult {
  valid: boolean;
  message: string;
}

interface ValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

const defaultOptions: ValidationOptions = {
  maxSize: 10 * 1024 * 1024, // 10MB default max size
  allowedTypes: [
    'application/pdf', // pdf
    'application/msword', // doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/vnd.ms-excel', // xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'application/vnd.ms-powerpoint', // ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
    'text/plain', // txt
    'text/csv', // csv
    'image/jpeg',
    'image/png',
    'image/gif'
  ]
};

export const validateFile = (
  file: File,
  options: ValidationOptions = {}
): ValidationResult => {
  const config = { ...defaultOptions, ...options };

  // Check file size
  if (config.maxSize && file.size > config.maxSize) {
    const maxSizeMB = Math.round(config.maxSize / (1024 * 1024));
    return {
      valid: false,
      message: `File is too large. Maximum size is ${maxSizeMB}MB.`
    };
  }

  // Check file type
  if (
    config.allowedTypes &&
    config.allowedTypes.length > 0 &&
    !config.allowedTypes.includes(file.type)
  ) {
    return {
      valid: false,
      message: 'File type not supported.'
    };
  }

  return {
    valid: true,
    message: 'File is valid.'
  };
};

export const getFileTypeFromMime = (mimeType: string): string => {
  const mimeMap: Record<string, string> = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'text/plain': 'txt',
    'text/csv': 'csv',
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/gif': 'image'
  };

  return mimeMap[mimeType] || 'unknown';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};