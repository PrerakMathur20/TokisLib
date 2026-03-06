import React from 'react';
import { cn } from '../../utils/cn.js';

export type ResultStatus = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ResultProps {
  status: ResultStatus;
  title: string;
  description?: string;
  extra?: React.ReactNode;
  className?: string;
}

const StatusIcon = ({ status }: { status: ResultStatus }) => {
  if (status === 'success') {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
        <path d="M14 24l7 7 13-14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === 'error') {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
        <path d="M16 16l16 16M32 16L16 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === 'warning') {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M24 6L42 40H6L24 6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M24 20v10M24 34v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === 'info') {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
        <path d="M24 22v12M24 16v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  // loading
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="tokis-result__spin">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 94.2" strokeLinecap="round" />
    </svg>
  );
};

export function Result({ status, title, description, extra, className }: ResultProps): JSX.Element {
  return (
    <div className={cn('tokis-result', `tokis-result--${status}`, className)}>
      <div className={cn('tokis-result__icon', `tokis-result__icon--${status}`)}>
        <StatusIcon status={status} />
      </div>
      <h3 className="tokis-result__title">{title}</h3>
      {description && <p className="tokis-result__description">{description}</p>}
      {extra && <div className="tokis-result__extra">{extra}</div>}
    </div>
  );
}

Result.displayName = 'Result';
