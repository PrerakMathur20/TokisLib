import React from 'react';
import { cn } from '../../utils/cn.js';

export type StatisticTrend = 'up' | 'down' | 'neutral';

export interface StatisticProps {
  value: string | number;
  label: string;
  prefix?: string;
  suffix?: string;
  trend?: StatisticTrend;
  trendValue?: string;
  description?: string;
  className?: string;
}

function TrendIcon({ trend }: { trend: StatisticTrend }): JSX.Element {
  if (trend === 'up') {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (trend === 'down') {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 3v8M3 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Statistic({
  value,
  label,
  prefix,
  suffix,
  trend,
  trendValue,
  description,
  className,
}: StatisticProps): JSX.Element {
  return (
    <div className={cn('tokis-statistic', className)}>
      <div className="tokis-statistic__label">{label}</div>
      <div className="tokis-statistic__value-row">
        {prefix && <span className="tokis-statistic__prefix">{prefix}</span>}
        <span className="tokis-statistic__value">{value}</span>
        {suffix && <span className="tokis-statistic__suffix">{suffix}</span>}
        {trend && trendValue && (
          <span
            className={cn('tokis-statistic__trend', `tokis-statistic__trend--${trend}`)}
            aria-label={`Trend: ${trend === 'up' ? 'up' : trend === 'down' ? 'down' : 'neutral'} ${trendValue}`}
          >
            <TrendIcon trend={trend} />
            {trendValue}
          </span>
        )}
      </div>
      {description && (
        <div className="tokis-statistic__desc">{description}</div>
      )}
    </div>
  );
}
