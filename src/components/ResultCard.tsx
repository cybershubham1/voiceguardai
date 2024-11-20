import React from 'react';
import { Shield, ShieldAlert, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  type: 'authentic' | 'deepfake' | 'uncertain';
  confidence: number;
  details: string;
  className?: string;
}

const ResultCard = ({ type, confidence, details, className }: ResultCardProps) => {
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
        <div>
          <h3 className="text-lg font-semibold capitalize">{type}</h3>
          <div className="mt-2 mb-4">
            <div className="text-sm text-gray-600">Confidence Score</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div
                className={cn(
                  "h-2.5 rounded-full",
                  type === 'authentic' ? 'bg-accent' : type === 'deepfake' ? 'bg-danger' : 'bg-warning'
                )}
                style={{ width: `${confidence}%` }}
              />
            </div>
            <div className="text-right text-sm text-gray-600 mt-1">
              {confidence}%
            </div>
          </div>
          <p className="text-sm text-gray-600">{details}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;