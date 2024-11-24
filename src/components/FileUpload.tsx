import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

const FileUpload = ({ onFileSelect, className }: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.webm', '.ogg'],
      'audio/*': ['.mp3', '.wav'],
      'text/*': ['.txt', '.md'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300',
        isDragActive ? 'border-primary bg-primary/5' : 'border-gray-700 hover:border-primary',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-primary/10">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <div>
          <p className="text-lg font-medium">
            {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            or click to select a file
          </p>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Supports images, videos, audio files, and text
        </div>
      </div>
    </div>
  );
};

export default FileUpload;