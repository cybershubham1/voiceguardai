import React, { useCallback, useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ResultCard from './ResultCard';

const WebcamDetection = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isCameraReady, setCameraReady] = useState(false);
  const { toast } = useToast();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
    aspectRatio: 1.777777778
  };

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        // Check if the browser supports getUserMedia
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Browser doesn't support camera access");
        }

        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: videoConstraints,
          audio: false 
        });

        // If we got here, we have camera access
        console.log("Camera permission granted");
        
        // Cleanup stream on unmount
        return () => {
          stream.getTracks().forEach(track => track.stop());
        };
      } catch (err) {
        console.error("Camera initialization error:", err);
        toast({
          variant: "destructive",
          title: "Camera Error",
          description: "Failed to access camera. Please ensure permissions are granted and refresh the page.",
        });
      }
    };

    initializeCamera();
  }, [toast]);

  const handleUserMedia = () => {
    console.log("Camera stream connected successfully");
    setCameraReady(true);
    toast({
      title: "Camera Connected",
      description: "Your camera is now ready for analysis.",
    });
  };

  const handleUserMediaError = (err: string | DOMException) => {
    console.error("Camera error:", err);
    setCameraReady(false);
    toast({
      variant: "destructive",
      title: "Camera Error",
      description: "Unable to access camera. Please check your permissions and refresh the page.",
    });
  };

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
          videoConstraints={videoConstraints}
          onUserMedia={handleUserMedia}
          onUserMediaError={handleUserMediaError}
          className="w-full h-full"
          mirrored={true}
        />
        <div className="absolute bottom-4 right-4">
          <Button
            onClick={analyzeFrame}
            disabled={isAnalyzing || !isCameraReady}
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

      {!isCameraReady && (
        <div className="text-center p-4 bg-secondary/50 rounded-lg">
          <p className="text-gray-400">Waiting for camera access...</p>
          <p className="text-sm text-gray-500 mt-2">Please allow camera permissions when prompted</p>
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

      <div className="mt-8 text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
        <p className="text-yellow-500 text-sm">⚠️ This tool is under testing - Beta version</p>
      </div>
    </div>
  );
};

export default WebcamDetection;