import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

// ─── Progress Bar ─────────────────────────────────────────
export type ProgressVariant = 'default' | 'success' | 'warning' | 'error';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0-100, undefined = indeterminate
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: ProgressVariant;
  size?: 'sm' | 'md' | 'lg';
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(({
  value, max = 100, label, showValue = false, variant = 'default', size = 'md', className, ...props
}, ref) => {
  const pct = value !== undefined ? Math.min(100, Math.max(0, (value / max) * 100)) : undefined;
  const isIndeterminate = pct === undefined;

  return (
    <div ref={ref} className={cn('tokis-progress-root', className)} {...props}>
      {(label || showValue) && (
        <div className="tokis-progress-label">
          {label && <span className="tokis-progress-label-text">{label}</span>}
          {showValue && !isIndeterminate && <span className="tokis-progress-label-value">{Math.round(pct!)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={cn('tokis-progress-track', size !== 'md' && `tokis-progress-track--${size}`)}
      >
        <div
          className={cn(
            'tokis-progress-fill',
            variant !== 'default' && `tokis-progress-fill--${variant}`,
            isIndeterminate && 'tokis-progress-fill--indeterminate'
          )}
          style={!isIndeterminate ? { width: `${pct}%` } : undefined}
        />
      </div>
    </div>
  );
});
Progress.displayName = 'Progress';

// ─── Skeleton ─────────────────────────────────────────────
export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'text' | 'rectangular' | 'circular' | 'wave';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(({
  variant = 'rectangular', width, height, lines, className, style, ...props
}, ref) => {
  if (lines && lines > 1) {
    return (
      <div className={className}>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className={cn('tokis-skeleton tokis-skeleton--text')}
            style={{ width: i === lines - 1 ? '70%' : '100%', marginBottom: i < lines - 1 ? '8px' : 0 }}
          />
        ))}
      </div>
    );
  }

  return (
    <span
      ref={ref}
      className={cn(
        'tokis-skeleton',
        variant === 'text' && 'tokis-skeleton--text',
        variant === 'circular' && 'tokis-skeleton--circle',
        variant === 'wave' && 'tokis-skeleton--wave',
        className
      )}
      style={{ display: 'block', width, height, ...style }}
      aria-hidden="true"
      {...props}
    />
  );
});
Skeleton.displayName = 'Skeleton';

// ─── Spinner ──────────────────────────────────────────────
export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white';
  label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(({ size = 'md', variant = 'default', label = 'Loading…', className, ...props }, ref) => (
  <span
    ref={ref}
    role="status"
    aria-label={label}
    className={cn(
      'tokis-spinner',
      size !== 'md' && `tokis-spinner--${size}`,
      variant === 'white' && 'tokis-spinner--white',
      className
    )}
    {...props}
  />
));
Spinner.displayName = 'Spinner';

