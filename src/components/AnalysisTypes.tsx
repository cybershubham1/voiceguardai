import React from 'react';
import { ArrowRight, Video, Mic, FileText, Image } from 'lucide-react';

const analysisTypes = [
  {
    type: 'Audio',
    icon: Mic,
    description: 'Advanced audio analysis detects voice manipulation, synthetic speech patterns, and inconsistencies in natural voice modulation. We examine frequency spectrums, background noise patterns, and acoustic signatures.'
  },
  {
    type: 'Video',
    icon: Video,
    description: 'Deep analysis of facial movements, lip-sync accuracy, and temporal consistency. We detect unnatural movements, lighting inconsistencies, and digital manipulation artifacts in video streams.'
  },
  {
    type: 'Text',
    icon: FileText,
    description: 'Natural language processing identifies AI-generated text by analyzing writing patterns, consistency, and linguistic markers typical of synthetic content.'
  },
  {
    type: 'Image',
    icon: Image,
    description: 'Advanced image analysis examines pixel-level patterns, metadata integrity, facial landmarks, and lighting consistency to detect digital manipulation and synthetic content generation.'
  }
];

const AnalysisTypes = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {analysisTypes.map(({ type, icon: Icon, description }) => (
        <div 
          key={type} 
          className="bg-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-primary/50 transition-colors duration-300"
        >
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            {type} Detection
            <ArrowRight className="w-4 h-4 text-accent" />
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AnalysisTypes;