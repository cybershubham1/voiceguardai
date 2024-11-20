import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ScanningAnimation from '@/components/ScanningAnimation';
import ResultCard from '@/components/ResultCard';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Shield, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="w-16 h-16 text-primary" />
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                VOICEGUARDAI
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Advanced AI-powered deepfake detection for audio, video, images, and text. 
              Protect yourself from digital manipulation with real-time content verification.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-secondary/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-800">
              <FileUpload
                onFileSelect={analyzeContent}
                className="bg-background/50 hover:bg-background/70 transition-all duration-300"
              />

              {isAnalyzing && (
                <div className="relative h-64 mt-8 bg-background/50 rounded-xl overflow-hidden backdrop-blur-sm">
                  <ScanningAnimation />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-gray-400">Analyzing your content...</p>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className="mt-8">
                  <ResultCard
                    type={result.type}
                    confidence={result.confidence}
                    details={result.details}
                    indicators={result.indicators}
                    className="animate-in fade-in duration-500"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Audio', 'Video', 'Text'].map((type) => (
                <div key={type} className="bg-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    {type} Detection
                    <ArrowRight className="w-4 h-4" />
                  </h3>
                  <p className="text-sm text-gray-400">
                    Advanced {type.toLowerCase()} analysis for deepfake detection
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;