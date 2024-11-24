import { supabase } from "@/integrations/supabase/client";

export type DetectionResult = {
  type: 'authentic' | 'deepfake' | 'uncertain';
  confidence: number;
  details: string;
  indicators: string[];
  metadata: Record<string, any>;
};

export type MediaType = 'image' | 'video' | 'audio' | 'text';

export async function analyzeContent(
  file: File | string,
  mediaType: MediaType,
  userId: string
): Promise<DetectionResult> {
  const startTime = performance.now();
  
  // Call the appropriate detection endpoint based on media type
  const response = await fetch('/api/detect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: file,
      mediaType,
    }),
  });

  const result = await response.json();
  const processingTime = (performance.now() - startTime) / 1000; // Convert to seconds

  // Store the detection result in Supabase
  const { error } = await supabase
    .from('detection_results')
    .insert({
      user_id: userId,
      media_type: mediaType,
      confidence_score: result.confidence,
      is_deepfake: result.type === 'deepfake',
      analysis_details: {
        details: result.details,
        indicators: result.indicators,
      },
      detection_method: `ml-model-${mediaType}`,
      analysis_metadata: result.metadata,
      processing_time: processingTime,
      model_version: '1.0.0',
    });

  if (error) {
    console.error('Error storing detection result:', error);
  }

  return result;
}

export function getIndicatorsByMediaType(mediaType: MediaType): string[] {
  switch (mediaType) {
    case 'image':
      return [
        'Analyzing metadata integrity',
        'Examining pixel patterns',
        'Checking facial features',
        'Analyzing lighting patterns',
        'Detecting manipulation signatures',
      ];
    case 'video':
      return [
        'Analyzing frame consistency',
        'Checking audio-visual sync',
        'Examining facial movements',
        'Detecting temporal anomalies',
        'Analyzing compression artifacts',
      ];
    case 'audio':
      return [
        'Analyzing frequency patterns',
        'Checking voice signatures',
        'Examining background noise',
        'Detecting audio splicing',
        'Analyzing voice modulation',
      ];
    case 'text':
      return [
        'Analyzing writing patterns',
        'Checking linguistic markers',
        'Examining content coherence',
        'Detecting AI patterns',
        'Analyzing style consistency',
      ];
  }
}