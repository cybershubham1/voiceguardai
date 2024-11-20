import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ScanningAnimation from '@/components/ScanningAnimation';
import ResultCard from '@/components/ResultCard';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Shield } from 'lucide-react';

type DetectionResult = {
  type: 'authentic' | 'deepfake' | 'uncertain';
  confidence: number;
  details: string;
  indicators: string[];
};

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const { toast } = useToast();

  const analyzeContent = async (file: File) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Simulate API call with advanced detection logic
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Advanced detection simulation based on file type
      const fileType = file.type.split('/')[0];
      const mockAnalysis = simulateDeepfakeDetection(fileType);
      
      setResult(mockAnalysis);
      toast({
        title: 'Analysis Complete',
        description: `Content analyzed as ${mockAnalysis.type} with ${mockAnalysis.confidence}% confidence.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to analyze content. Please try again.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulateDeepfakeDetection = (fileType: string): DetectionResult => {
    const isDeepfake = Math.random() > 0.5;
    const confidence = Math.floor(Math.random() * 30) + 70;
    
    const baseIndicators = {
      image: [
        'Analyzing facial features and inconsistencies',
        'Checking metadata and digital signatures',
        'Examining lighting and shadow patterns',
      ],
      video: [
        'Analyzing temporal consistency',
        'Checking lip-sync accuracy',
        'Examining facial expressions and movements',
      ],
      audio: [
        'Analyzing voice patterns and frequencies',
        'Checking audio waveform consistency',
        'Examining background noise patterns',
      ],
      text: [
        'Analyzing writing style and patterns',
        'Checking content consistency',
        'Examining linguistic markers',
      ],
    }[fileType] || ['Analyzing content patterns', 'Checking digital signatures'];

    return {
      type: isDeepfake ? 'deepfake' : 'authentic',
      confidence,
      details: isDeepfake 
        ? 'Our AI has detected potential manipulation in this content.'
        : 'Our analysis suggests this content is likely authentic.',
      indicators: baseIndicators,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-accent" />
            <h1 className="text-4xl font-bold text-gray-900">
              VOICEGUARDAI
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced AI-powered deepfake detection for audio, video, images, and text. 
            Protect yourself from digital manipulation with real-time content verification.
          </p>
        </div>

        <div className="space-y-8">
          <FileUpload
            onFileSelect={analyzeContent}
            className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
          />

          {isAnalyzing && (
            <div className="relative h-64 bg-white rounded-lg shadow-lg overflow-hidden">
              <ScanningAnimation />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  <p className="text-gray-600">Analyzing your content...</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <ResultCard
              type={result.type}
              confidence={result.confidence}
              details={result.details}
              indicators={result.indicators}
              className="animate-in fade-in duration-500"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;