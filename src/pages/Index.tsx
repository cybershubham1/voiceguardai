import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ScanningAnimation from '@/components/ScanningAnimation';
import ResultCard from '@/components/ResultCard';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

type DetectionResult = {
  type: 'authentic' | 'deepfake' | 'uncertain';
  confidence: number;
  details: string;
};

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const { toast } = useToast();

  const analyzeFile = async (file: File) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock result - replace with actual API response
      const mockResult: DetectionResult = {
        type: Math.random() > 0.5 ? 'authentic' : 'deepfake',
        confidence: Math.floor(Math.random() * 30) + 70,
        details: 'Analysis complete. Check the detailed report below.',
      };
      
      setResult(mockResult);
      toast({
        title: 'Analysis Complete',
        description: `File analyzed as ${mockResult.type} with ${mockResult.confidence}% confidence.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to analyze file. Please try again.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Deepfake Detection
          </h1>
          <p className="text-lg text-gray-600">
            Upload any media file for real-time deepfake analysis
          </p>
        </div>

        <div className="space-y-8">
          <FileUpload
            onFileSelect={analyzeFile}
            className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
          />

          {isAnalyzing && (
            <div className="relative h-64 bg-white rounded-lg shadow-lg overflow-hidden">
              <ScanningAnimation />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  <p className="text-gray-600">Analyzing your file...</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <ResultCard
              type={result.type}
              confidence={result.confidence}
              details={result.details}
              className="animate-in fade-in duration-500"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;