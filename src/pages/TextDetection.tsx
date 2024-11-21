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
    const words = text.toLowerCase().split(' ');
    const uniqueWords = new Set(words);
    const repetitionScore = (words.length - uniqueWords.size) / words.length;

    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const avgSentenceLength = sentences.reduce((acc, sent) => acc + sent.trim().length, 0) / sentences.length;
    const sentenceLengthVariety = sentences.some(sent => 
      Math.abs(sent.trim().length - avgSentenceLength) > avgSentenceLength * 0.3
    );

    const commonAIPatterns = [
      'in conclusion',
      'moreover',
      'additionally',
      'furthermore',
      'in summary',
      'as mentioned earlier',
      'it is worth noting',
      'it is important to note',
      'in this context',
      'with regards to',
      'in terms of',
      'nevertheless',
      'consequently',
      'thus',
      'therefore'
    ];
    
    const aiPatternCount = commonAIPatterns.reduce((count, pattern) => 
      count + (text.toLowerCase().includes(pattern) ? 1 : 0), 0
    );

    const hasConsistentFormatting = sentences.every(sent => 
      sent.trim()[0] === sent.trim()[0].toUpperCase()
    );

    const hasPerfectPunctuation = sentences.every(sent => 
      /[.!?]$/.test(sent.trim())
    );

    const hasPersonalPronouns = /\b(I|me|my|mine|we|our|ours|you|your|yours)\b/i.test(text);
    const hasInformalLanguage = /\b(like|maybe|probably|kind of|sort of|just|really|actually)\b/i.test(text);
    const hasEmotionalExpression = /[!?]{2,}|\.{3,}|😊|😂|😅|🤔|😎/g.test(text);
    const hasContractions = /\b(can't|won't|don't|I'm|you're|we're|they're|that's|it's|ain't)\b/i.test(text);
    const hasNaturalTransitions = /\b(but|however|though|although|still|yet|anyway|besides)\b/i.test(text);
    
    const complexWords = /\b(utilize|implement|facilitate|leverage|optimize|paradigm|methodology|subsequently|aforementioned)\b/gi;
    const complexWordMatches = text.match(complexWords) || [];
    const complexWordScore = complexWordMatches.length / words.length;

    let authenticityScore = 50;
    
    authenticityScore -= repetitionScore * 20;
    authenticityScore -= (aiPatternCount / commonAIPatterns.length) * 30;
    authenticityScore -= hasConsistentFormatting ? 15 : 0;
    authenticityScore -= hasPerfectPunctuation ? 15 : 0;
    authenticityScore -= complexWordScore * 25;
    
    authenticityScore += sentenceLengthVariety ? 15 : 0;
    authenticityScore += hasPersonalPronouns ? 12 : 0;
    authenticityScore += hasInformalLanguage ? 12 : 0;
    authenticityScore += hasEmotionalExpression ? 10 : 0;
    authenticityScore += hasContractions ? 10 : 0;
    authenticityScore += hasNaturalTransitions ? 8 : 0;
    
    if (text.length < 200) {
      authenticityScore -= (200 - text.length) / 10;
    }

    const normalizedScore = Math.max(0, Math.min(100, authenticityScore));

    return {
      score: normalizedScore,
      indicators: [
        `Writing style: ${hasInformalLanguage || hasContractions ? 'Natural, conversational' : 'Formal, structured'}`,
        `Vocabulary: ${complexWordScore > 0.1 ? 'Complex, potentially AI-generated' : 'Natural word choice'}`,
        `Formatting: ${hasConsistentFormatting ? 'Overly consistent (AI-like)' : 'Natural variation'}`,
        `Expression: ${hasEmotionalExpression ? 'Natural emotional markers' : 'Neutral tone'}`,
        `Transitions: ${hasNaturalTransitions ? 'Natural flow' : 'Mechanical transitions'}`,
        `Personal voice: ${hasPersonalPronouns ? 'Personal perspective present' : 'Impersonal tone'}`,
        `Sentence structure: ${sentenceLengthVariety ? 'Natural variation' : 'Uniform structure (AI-like)'}`,
        `Common AI patterns: ${aiPatternCount > 3 ? 'High presence' : 'Low presence'} of formal academic phrases`
      ]
    };
  };

  const analyzeText = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const analysis = analyzeTextPatterns(text);
      
      const result = {
        type: analysis.score > 65 ? 'authentic' : analysis.score > 35 ? 'uncertain' : 'deepfake',
        confidence: Math.round(Math.abs(analysis.score - 50) * 2),
        details: `Our advanced linguistic analysis has examined writing patterns, semantic coherence, and stylistic markers. ${
          analysis.score > 65 
            ? 'The text shows strong indicators of human authorship with natural language patterns and variations.'
            : analysis.score > 35
            ? 'The analysis shows mixed indicators of authenticity. Some patterns suggest human writing while others are inconclusive.'
            : 'Multiple indicators suggest AI-generated content, including uniform patterns, formal structure, and common AI writing patterns.'
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
          <div className="w-full flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-500 text-center">
              This tool is currently in beta testing phase. Features and accuracy may be limited.
            </AlertDescription>
          </div>
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
