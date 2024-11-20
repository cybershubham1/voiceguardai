import React, { useCallback, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ResultCard from './ResultCard';

const AudioDetection = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = async (e) => {
        setIsRecording(false);
        setIsAnalyzing(true);

        // Simulate analysis
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const confidence = Math.random() * 30 + 70;
        const isLikelyDeepfake = confidence < 85;
        
        setResult({
          type: isLikelyDeepfake ? 'deepfake' : 'authentic',
          confidence: Math.round(confidence),
          details: isLikelyDeepfake 
            ? 'Potential voice manipulation detected in audio stream.'
            : 'No signs of voice manipulation detected in audio stream.',
          indicators: [
            'Analyzing voice frequency patterns',
            'Checking audio waveform consistency',
            'Verifying natural voice modulation',
            'Examining background noise patterns',
            'Detecting voice synthesis artifacts'
          ]
        });

        toast({
          title: 'Analysis Complete',
          description: `Audio analyzed as ${isLikelyDeepfake ? 'potential deepfake' : 'authentic'}`,
        });

        setIsAnalyzing(false);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: 'Recording Started',
        description: 'Recording audio for analysis...',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to access microphone',
      });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [isRecording]);

  return (
    <div className="space-y-4">
      <div className="p-8 rounded-lg bg-background/50 backdrop-blur-sm border border-gray-800 flex flex-col items-center justify-center gap-4">
        <div className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <Mic className={`w-12 h-12 ${isRecording ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
          {isRecording && (
            <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping" />
          )}
        </div>
        
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isAnalyzing}
          variant={isRecording ? "destructive" : "default"}
          className="flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : isRecording ? (
            <>
              <Square className="w-4 h-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Start Recording
            </>
          )}
        </Button>
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

export default AudioDetection;