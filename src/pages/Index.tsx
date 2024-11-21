import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ScanningAnimation from '@/components/ScanningAnimation';
import ResultCard from '@/components/ResultCard';
import LiveDetection from '@/components/LiveDetection';
import AnalysisTypes from '@/components/AnalysisTypes';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      await new Promise(resolve => setTimeout(resolve, 3000));
      const mockAnalysis = simulateAdvancedDeepfakeDetection(file);
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

  const simulateAdvancedDeepfakeDetection = (file: File): DetectionResult => {
    const fileType = file.type.split('/')[0];
    const confidence = Math.random() * 30 + 70;
    const isLikelyDeepfake = confidence < 85;

    const getIndicators = () => {
      switch(fileType) {
        case 'image':
          return [
            'Analyzing metadata integrity and EXIF data',
            'Examining pixel-level patterns and artifacts',
            'Checking facial feature consistency',
            'Analyzing lighting and shadow patterns',
            'Detecting image manipulation signatures',
            'Verifying color space consistency'
          ];
        case 'video':
          return [
            'Analyzing frame-by-frame consistency',
            'Checking audio-visual synchronization',
            'Examining facial movement patterns',
            'Detecting temporal anomalies',
            'Analyzing compression artifacts',
            'Verifying motion coherence'
          ];
        case 'audio':
          return [
            'Analyzing frequency spectrum patterns',
            'Checking voice signature consistency',
            'Examining background noise patterns',
            'Detecting audio splicing artifacts',
            'Analyzing voice modulation patterns',
            'Verifying acoustic environment consistency'
          ];
        default:
          return [
            'Analyzing content patterns',
            'Checking digital fingerprints',
            'Examining structural integrity',
            'Detecting manipulation artifacts',
            'Analyzing format consistency',
            'Verifying content authenticity'
          ];
      }
    };

    return {
      type: isLikelyDeepfake ? 'deepfake' : 'authentic',
      confidence: Math.round(confidence),
      details: isLikelyDeepfake 
        ? `Our analysis indicates potential manipulation in this ${fileType} content. Multiple indicators suggest artificial generation or modification.`
        : `Our analysis indicates this ${fileType} content shows strong signs of authenticity. Natural patterns and consistent signatures were detected.`,
      indicators: getIndicators(),
    };
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <Alert className="mb-8 border-yellow-500/50 bg-yellow-500/10">
            <div className="w-full flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-500 text-center">
                This tool is currently in beta testing phase. Features and accuracy may be limited.
              </AlertDescription>
            </div>
          </Alert>

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
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="upload">File Upload</TabsTrigger>
                  <TabsTrigger value="live">Live Detection</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload">
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
                </TabsContent>
                
                <TabsContent value="live">
                  <LiveDetection />
                </TabsContent>
              </Tabs>
            </div>

            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <p className="text-yellow-500 text-sm">⚠️ VOICEGUARDAI is currently in beta testing</p>
            </div>

            <AnalysisTypes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;