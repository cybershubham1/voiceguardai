import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from 'lucide-react';
import ResultCard from '@/components/ResultCard';
import { Alert, AlertDescription } from "@/components/ui/alert";

const TextDetection = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    type: 'authentic' | 'deepfake' | 'uncertain';
    confidence: number;
    details: string;
    indicators: string[];
  } | null>(null);

  const analyzeText = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Simulated analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock analysis result
      const mockResult = {
        type: Math.random() > 0.5 ? 'authentic' : 'deepfake',
        confidence: Math.floor(Math.random() * 30 + 70),
        details: "Our analysis has examined linguistic patterns, consistency, and writing style markers to determine the authenticity of this text.",
        indicators: [
          "Semantic coherence analysis",
          "Writing style consistency check",
          "Language pattern recognition",
          "Contextual relevance assessment",
          "Structural analysis completion",
          "Linguistic marker detection"
        ]
      };

      setResult(mockResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Alert className="mb-8 border-yellow-500/50 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-500">
            This tool is currently in beta testing phase. Features and accuracy may be limited.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Text Analysis</h1>
            <p className="text-gray-400">
              Paste your text below to analyze for potential AI-generated content
            </p>
          </div>

          <div className="space-y-4">
            <Textarea
              placeholder="Paste your text here for analysis..."
              className="min-h-[200px] bg-secondary/50 border-gray-700"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <Button
              onClick={analyzeText}
              disabled={isAnalyzing || !text.trim()}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Text...
                </>
              ) : (
                'Analyze Text'
              )}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-400">Analyzing text patterns and characteristics...</p>
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

        <div className="text-center p-4 mt-8 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <p className="text-yellow-500 text-sm">⚠️ VOICEGUARDAI is currently in beta testing</p>
        </div>
      </div>
    </div>
  );
};

export default TextDetection;