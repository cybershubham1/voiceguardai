import React from 'react';
import { Shield, ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';
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
        return 'bg-accent/10';
      case 'deepfake':
        return 'bg-danger/10';
      default:
        return 'bg-warning/10';
    }
  };

  return (
    <div className={cn(
      'rounded-lg p-6 transition-all duration-300',
      getBackground(),
      className
    )}>
      <div className="flex items-start gap-4">
        {getIcon()}
        <div className="flex-1">
          <h3 className="text-xl font-semibold capitalize flex items-center gap-2">
            {type}
            <span className="text-sm font-normal text-gray-600">
              ({confidence}% confidence)
            </span>
          </h3>
          
          <div className="mt-4 mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={cn(
                  "h-2.5 rounded-full transition-all duration-500",
                  type === 'authentic' ? 'bg-accent' : type === 'deepfake' ? 'bg-danger' : 'bg-warning'
                )}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          <p className="text-gray-700 mb-4">{details}</p>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Analysis Indicators:</h4>
            <ul className="space-y-2">
              {indicators.map((indicator, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
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