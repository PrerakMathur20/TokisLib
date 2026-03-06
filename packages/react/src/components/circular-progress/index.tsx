import React from 'react';
import { cn } from '../../utils/cn.js';

export type CircularProgressSize = 'sm' | 'md' | 'lg' | 'xl';

export interface CircularProgressProps {
  value?: number;
  size?: CircularProgressSize;
  strokeWidth?: number;
  label?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

const sizeMap: Record<CircularProgressSize, number> = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
};

const strokeWidthMap: Record<CircularProgressSize, number> = {
  sm: 3,
  md: 4,
  lg: 5,
  xl: 6,
};

export function CircularProgress({
  value,
  size = 'md',
  strokeWidth,
  label,
  variant = 'default',
  className,
}: CircularProgressProps): JSX.Element {
  const svgSize = sizeMap[size];
  const sw = strokeWidth ?? strokeWidthMap[size];
  const radius = (svgSize - sw) / 2;
  const circumference = 2 * Math.PI * radius;
  const isIndeterminate = value === undefined;
  const clampedValue = Math.min(100, Math.max(0, value ?? 0));
  const offset = circumference * (1 - clampedValue / 100);

  return (
    <div
      className={cn('tokis-circular-progress', `tokis-circular-progress--${size}`, `tokis-circular-progress--${variant}`, isIndeterminate && 'tokis-circular-progress--indeterminate', className)}
      role="progressbar"
      aria-valuenow={isIndeterminate ? undefined : clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={isIndeterminate ? 'Loading…' : `${clampedValue}%`}
    >
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} fill="none">
        {/* Track */}
        <circle
          className="tokis-circular-progress__track"
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          strokeWidth={sw}
        />
        {/* Fill */}
        <circle
          className="tokis-circular-progress__fill"
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          strokeWidth={sw}
          strokeDasharray={circumference}
          strokeDashoffset={isIndeterminate ? circumference * 0.75 : offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
        />
      </svg>
      {label && <div className="tokis-circular-progress__label">{label}</div>}
    </div>
  );
}

CircularProgress.displayName = 'CircularProgress';
