import React from 'react';
import { cn } from '@/lib/utils';

interface ScanningAnimationProps {
  className?: string;
}

const ScanningAnimation = ({ className }: ScanningAnimationProps) => {
  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/20 to-transparent animate-scan" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-accent/20 animate-pulse" />
      </div>
    </div>
  );
};

export default ScanningAnimation;