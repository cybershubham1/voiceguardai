import React, { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/components/ui/use-toast';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const TrainingDataUpload = () => {
  const session = useSession();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeepfake, setIsDeepfake] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!session?.user) return;
    setIsUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('training-data')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('training-data')
        .getPublicUrl(filePath);

      // Process with OpenAI for feature extraction
      const { data: features, error } = await supabase.functions.invoke('process-training-data', {
        body: {
          fileUrl: publicUrl,
          mediaType: file.type.split('/')[0],
          isDeepfake
        }
      });

      if (error) throw error;

      // Save training data record
      const { error: dbError } = await supabase
        .from('training_data')
        .insert({
          user_id: session.user.id,
          media_type: file.type.split('/')[0],
          file_url: publicUrl,
          is_deepfake: isDeepfake,
          features: features,
          metadata: {
            filename: file.name,
            size: file.size,
            type: file.type
          }
        });

      if (dbError) throw dbError;

      toast({
        title: 'Success',
        description: 'Training data uploaded and processed successfully.',
      });
    } catch (error) {
      console.error('Error uploading training data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to upload and process training data.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="is-deepfake"
          checked={isDeepfake}
          onCheckedChange={setIsDeepfake}
        />
        <Label htmlFor="is-deepfake">This is deepfake content</Label>
      </div>

      {isUploading ? (
        <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-xl border-gray-700">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-gray-400">Processing training data...</p>
          </div>
        </div>
      ) : (
        <FileUpload onFileSelect={handleFileSelect} />
      )}
    </div>
  );
};

export default TrainingDataUpload;