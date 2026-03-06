import React, { useEffect, useRef, useId } from 'react';
import { cn } from '../../utils/cn.js';
import { Portal } from '../portal/index.js';
import { trapFocus } from '/core';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function Dialog({
  open, onClose, title, description, children, footer,
  size = 'md', closeOnBackdrop = true, closeOnEsc = true,
  className, 'aria-label': ariaLabel,
}: DialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const titleId = title ? `dialog-title-${uid}` : undefined;
  const descId = description ? `dialog-desc-${uid}` : undefined;

  useEffect(() => {
    if (!open) return;
    const cleanup = contentRef.current ? trapFocus(contentRef.current) : undefined;
    const prev = document.activeElement as HTMLElement | null;
    contentRef.current?.focus();
    return () => {
      cleanup?.();
      prev?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open, closeOnEsc, onClose]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  if (!open) return null;

  return (
    <Portal>
      <div
        className="tokis-dialog-backdrop"
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
      >
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          aria-label={!title ? ariaLabel : undefined}
          tabIndex={-1}
          className={cn('tokis-dialog-content', size !== 'md' && `tokis-dialog-content--${size}`, className)}
          onClick={(e) => e.stopPropagation()}
        >
          {(title || description) && (
            <div className="tokis-dialog-header">
              <div>
                {title && <h2 id={titleId} className="tokis-dialog-title">{title}</h2>}
                {description && <p id={descId} className="tokis-dialog-description">{description}</p>}
              </div>
              <button className="tokis-dialog-close" onClick={onClose} aria-label="Close dialog">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          )}
          {children && <div className="tokis-dialog-body">{children}</div>}
          {footer && <div className="tokis-dialog-footer">{footer}</div>}
        </div>
      </div>
    </Portal>
  );
}


