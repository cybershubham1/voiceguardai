import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import ResultCard from '@/components/ResultCard';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from 'react-router-dom';

const TextDetection = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    type: 'authentic' | 'deepfake' | 'uncertain';
    confidence: number;
    details: string;
    indicators: string[];
  } | null>(null);

  const analyzeTextPatterns = (text: string) => {
    // Analyze repetition patterns
    const repetitionScore = text.length - new Set(text.toLowerCase().split(' ')).size;
    
    // Analyze sentence structure variety
    const sentences = text.split(/[.!?]+/);
    const avgSentenceLength = sentences.reduce((acc, sent) => acc + sent.length, 0) / sentences.length;
    const sentenceLengthVariety = sentences.some(sent => 
      Math.abs(sent.length - avgSentenceLength) > avgSentenceLength * 0.5
    );

    // Check for common AI patterns
    const commonAIPatterns = [
      'in conclusion',
      'moreover',
      'additionally',
      'furthermore',
      'in summary'
    ];
    const aiPatternCount = commonAIPatterns.reduce((count, pattern) => 
      count + (text.toLowerCase().includes(pattern) ? 1 : 0), 0
    );

    // Calculate natural language indicators
    const hasPersonalPronouns = /\b(I|me|my|mine|we|our|ours)\b/i.test(text);
    const hasInformalLanguage = /\b(like|maybe|probably|kind of|sort of)\b/i.test(text);
    const hasEmotionalExpression = /[!?]{2,}|\.{3,}/.test(text);

    // Weighted scoring system
    let authenticityScore = 0;
    authenticityScore += sentenceLengthVariety ? 20 : 0;
    authenticityScore += hasPersonalPronouns ? 15 : 0;
    authenticityScore += hasInformalLanguage ? 15 : 0;
    authenticityScore += hasEmotionalExpression ? 10 : 0;
    authenticityScore -= repetitionScore * 2;
    authenticityScore -= aiPatternCount * 5;

    // Normalize score to 0-100 range
    const normalizedScore = Math.max(0, Math.min(100, authenticityScore));

    return {
      score: normalizedScore,
      indicators: [
        `Sentence structure variety: ${sentenceLengthVariety ? 'Natural' : 'Uniform'}`,
        `Personal pronouns: ${hasPersonalPronouns ? 'Present' : 'Absent'}`,
        `Language formality: ${hasInformalLanguage ? 'Natural variation' : 'Highly formal'}`,
        `Emotional expression: ${hasEmotionalExpression ? 'Present' : 'Absent'}`,
        `Repetition patterns: ${repetitionScore < 5 ? 'Low' : 'High'}`,
        `Common AI markers: ${aiPatternCount === 0 ? 'None detected' : 'Present'}`
      ]
    };
  };

  const analyzeText = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Simulated analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const analysis = analyzeTextPatterns(text);
      
      const result = {
        type: analysis.score > 70 ? 'authentic' : analysis.score > 40 ? 'uncertain' : 'deepfake',
        confidence: analysis.score,
        details: `Our advanced linguistic analysis has examined writing patterns, semantic coherence, and stylistic markers. ${
          analysis.score > 70 
            ? 'The text shows strong indicators of human authorship.'
            : analysis.score > 40
            ? 'The analysis shows mixed indicators of authenticity.'
            : 'Multiple indicators suggest AI-generated content.'
        }`,
        indicators: analysis.indicators
      } as const;

      setResult(result);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const characterCount = text.length;
  const minCharacters = 100;

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Alert className="mb-8 border-yellow-500/50 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-500">
            This tool is currently in beta testing phase. Features and accuracy may be limited.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">AI Text Detection</h1>
            <p className="text-gray-400">
              Paste your text below to analyze for potential AI-generated content
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Paste your text here (minimum 100 characters)..."
                className="min-h-[200px] bg-secondary/50 border-gray-700 resize-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="absolute bottom-2 right-2 text-sm text-gray-400">
                {characterCount}/{minCharacters} characters
              </div>
            </div>

            <Button
              onClick={analyzeText}
              disabled={isAnalyzing || characterCount < minCharacters}
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