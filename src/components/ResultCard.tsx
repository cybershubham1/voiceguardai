import React from 'react';
import { Shield, ShieldAlert, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  type: 'authentic' | 'deepfake' | 'uncertain';
  confidence: number;
  details: string;
  indicators: string[];
  className?: string;
}

const ResultCard = ({ type, confidence, details, indicators, className }: ResultCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'authentic':
        return <Shield className="w-8 h-8 text-accent" />;
      case 'deepfake':
        return <ShieldAlert className="w-8 h-8 text-danger" />;
      default:
        return <AlertCircle className="w-8 h-8 text-warning" />;
    }
  };

  const getBackground = () => {
    switch (type) {
      case 'authentic':
        return 'bg-accent/10 border-accent/20';
      case 'deepfake':
        return 'bg-danger/10 border-danger/20';
      default:
        return 'bg-warning/10 border-warning/20';
    }
  };

  // Calculate percentages based on confidence
  const aiPercentage = type === 'deepfake' ? confidence : 0;
  const humanPercentage = type === 'authentic' ? confidence : 0;

  return (
    <div className={cn(
      'rounded-xl p-6 transition-all duration-300 border backdrop-blur-sm',
      getBackground(),
      className
    )}>
      <div className="flex items-start gap-4">
        {getIcon()}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold capitalize flex items-center gap-2">
              {type}
              <span className="text-sm font-normal text-gray-400">
                ({confidence}% confidence)
              </span>
            </h3>
            <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80">
              <Download className="w-4 h-4" />
              Download report
            </button>
          </div>
          
          <div className="mt-4 mb-6">
            <div className="w-full bg-gray-800 rounded-full h-2.5">
              <div
                className={cn(
                  "h-2.5 rounded-full transition-all duration-500",
                  type === 'authentic' ? 'bg-accent' : type === 'deepfake' ? 'bg-danger' : 'bg-warning'
                )}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          <div className="bg-background/50 rounded-lg p-4 mb-6">
            <div className="text-3xl font-bold text-center mb-2">
              {aiPercentage}%
            </div>
            <div className="text-sm text-center text-gray-400">
              of text is likely AI-generated
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-danger" />
                  AI-generated
                </span>
                <span>{aiPercentage}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  AI-generated & AI-refined
                </span>
                <span>0%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Human-written & AI-refined
                </span>
                <span>0%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                  Human-written
                </span>
                <span>{humanPercentage}%</span>
              </div>
            </div>
          </div>

          <p className="text-gray-300 mb-4">{details}</p>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-200">Analysis Indicators:</h4>
            <ul className="space-y-2">
              {indicators.map((indicator, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  {indicator}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;