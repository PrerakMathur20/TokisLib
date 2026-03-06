import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const AlertIcons: Record<AlertVariant, React.ReactNode> = {
  info: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  success: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  warning: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2L1.5 13h13L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 7v2.5M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  error: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant;
  title?: React.ReactNode;
  onClose?: () => void;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(({
  variant = 'info', title, onClose, icon, action, className, children, ...props
}, ref) => (
  <div
    ref={ref}
    role="alert"
    aria-live="polite"
    className={cn('tokis-alert', `tokis-alert--${variant}`, className)}
    {...props}
  >
    <span className="tokis-alert__icon">{icon ?? AlertIcons[variant]}</span>
    <div className="tokis-alert__body">
      {title && <div className="tokis-alert__title">{title}</div>}
      {children && <div className="tokis-alert__message">{children}</div>}
      {action && <div style={{ marginTop: 'var(--tokis-spacing-2)' }}>{action}</div>}
    </div>
    {onClose && (
      <button className="tokis-alert__close" onClick={onClose} aria-label="Dismiss">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    )}
  </div>
));
Alert.displayName = 'Alert';


