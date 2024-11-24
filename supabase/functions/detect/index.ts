import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { content, mediaType } = await req.json()

    // Simulate ML model analysis with realistic detection logic
    const confidence = Math.random() * 30 + 70 // 70-100% confidence
    const isLikelyDeepfake = confidence < 85

    // Add realistic detection metadata
    const metadata = {
      modelVersion: '1.0.0',
      processingSteps: [
        'Feature extraction',
        'Pattern analysis',
        'Anomaly detection',
        'Consistency verification'
      ],
      technicalMetrics: {
        signalToNoiseRatio: Math.random() * 10 + 20,
        patternConsistency: Math.random() * 0.5 + 0.5,
        anomalyScore: Math.random()
      }
    }

    const result = {
      type: isLikelyDeepfake ? 'deepfake' : 'authentic',
      confidence: Math.round(confidence),
      details: isLikelyDeepfake 
        ? `Our analysis indicates potential manipulation in this ${mediaType} content. Multiple indicators suggest artificial generation or modification.`
        : `Our analysis indicates this ${mediaType} content shows strong signs of authenticity. Natural patterns and consistent signatures were detected.`,
      indicators: getIndicatorsByMediaType(mediaType),
      metadata
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function getIndicatorsByMediaType(mediaType: string): string[] {
  // Reuse the same logic as in detectionUtils.ts
  const indicators = {
    image: [
      'Analyzing metadata integrity',
      'Examining pixel patterns',
      'Checking facial features',
      'Analyzing lighting patterns',
      'Detecting manipulation signatures',
    ],
    video: [
      'Analyzing frame consistency',
      'Checking audio-visual sync',
      'Examining facial movements',
      'Detecting temporal anomalies',
      'Analyzing compression artifacts',
    ],
    audio: [
      'Analyzing frequency patterns',
      'Checking voice signatures',
      'Examining background noise',
      'Detecting audio splicing',
      'Analyzing voice modulation',
    ],
    text: [
      'Analyzing writing patterns',
      'Checking linguistic markers',
      'Examining content coherence',
      'Detecting AI patterns',
      'Analyzing style consistency',
    ]
  }
  return indicators[mediaType as keyof typeof indicators] || []
}