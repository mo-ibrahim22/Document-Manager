import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { validateFile } from '../../lib/fileValidation';
import { useUI } from '../../contexts/UIContext';

interface FileUploadDropProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
}

const FileUploadDrop: React.FC<FileUploadDropProps> = ({ 
  onFilesSelected, 
  multiple = false 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showNotification } = useUI();
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const validateFiles = (fileList: File[]): File[] => {
    const validFiles: File[] = [];
    
    for (const file of fileList) {
      const result = validateFile(file);
      if (result.valid) {
        validFiles.push(file);
      } else {
        showNotification(result.message, 'error');
      }
    }
    
    return validFiles;
  };
  
  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    
    const newFiles = Array.from(fileList);
    const validFiles = validateFiles(newFiles);
    
    if (!multiple) {
      setFiles(validFiles.slice(0, 1));
      onFilesSelected(validFiles.slice(0, 1));
    } else {
      setFiles(prev => {
        const updated = [...prev, ...validFiles];
        onFilesSelected(updated);
        return updated;
      });
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };
  
  const handleRemoveFile = (index: number) => {
    setFiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      onFilesSelected(updated);
      return updated;
    });
  };
  
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple={multiple}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,image/*"
        />
        
        <div className="flex flex-col items-center justify-center py-4">
          <Upload size={32} className="text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PDF, Word, Excel, PowerPoint, Text, CSV, Images
          </p>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li 
                key={index} 
                className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex items-center truncate">
                  <span className="text-sm text-gray-600 truncate">
                    {file.name}
                  </span>
                </div>
                <button
                  className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploadDrop;