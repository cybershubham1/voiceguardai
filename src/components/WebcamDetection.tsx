import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ResultCard from './ResultCard';

const WebcamDetection = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const analyzeFrame = useCallback(async () => {
    if (!webcamRef.current) return;

    setIsAnalyzing(true);
    const screenshot = webcamRef.current.getScreenshot();
    
    try {
      // Simulate real-time analysis
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const confidence = Math.random() * 30 + 70;
      const isLikelyDeepfake = confidence < 85;
      
      setResult({
        type: isLikelyDeepfake ? 'deepfake' : 'authentic',
        confidence: Math.round(confidence),
        details: isLikelyDeepfake 
          ? 'Potential facial manipulation detected in video stream.'
          : 'No signs of manipulation detected in video stream.',
        indicators: [
          'Analyzing facial landmarks and expressions',
          'Checking for unnatural movements',
          'Verifying lighting consistency',
          'Examining lip-sync accuracy',
          'Detecting facial texture anomalies'
        ]
      });

      toast({
        title: 'Analysis Complete',
        description: `Stream analyzed as ${isLikelyDeepfake ? 'potential deepfake' : 'authentic'}`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to analyze video stream',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-background/50 backdrop-blur-sm border border-gray-800">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="w-full h-full"
        />
        <div className="absolute bottom-4 right-4">
          <Button
            onClick={analyzeFrame}
            disabled={isAnalyzing}
            className="flex items-center gap-2"
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Frame'}
          </Button>
        </div>
      </div>

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
  );
};

export default WebcamDetection;