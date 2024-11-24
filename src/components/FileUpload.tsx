import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { analyzeContent } from '@/utils/detectionUtils';
import { useAuth } from '@supabase/auth-helpers-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

const FileUpload = ({ onFileSelect, className }: FileUploadProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();

  const handleFileAnalysis = async (file: File) => {
    if (!auth?.user?.id) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to analyze files.",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const mediaType = file.type.split('/')[0] as 'image' | 'video' | 'audio' | 'text';
      const result = await analyzeContent(file, mediaType, auth.user.id);
      
      onFileSelect(file);
      
      toast({
        title: "Analysis Complete",
        description: `Content analyzed as ${result.type} with ${result.confidence}% confidence.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Failed to analyze the file. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileAnalysis(acceptedFiles[0]);
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
        isAnalyzing && 'pointer-events-none opacity-50',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-primary/10">
          {isAnalyzing ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-primary" />
          )}
        </div>
        <div>
          <p className="text-lg font-medium">
            {isAnalyzing 
              ? 'Analyzing your file...' 
              : isDragActive 
                ? 'Drop your file here' 
                : 'Drag & drop your file here'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {!isAnalyzing && 'or click to select a file'}
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