import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import { cn } from '../../utils/cn.js';
import { Portal } from '../portal/index.js';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

export interface PopoverProps {
  trigger: React.ReactElement;
  content: React.ReactNode;
  title?: React.ReactNode;
  placement?: PopoverPlacement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

export function Popover({ trigger, content, title, placement = 'bottom-start', open, defaultOpen = false, onOpenChange, closeOnClickOutside = true, closeOnEsc = true, className }: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();

  const setOpen = useCallback((val: boolean) => {
    if (open === undefined) setInternalOpen(val);
    onOpenChange?.(val);
  }, [open, onOpenChange]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const gap = 8;
    let top = 0; let left = 0;
    const base = placement.split('-')[0];
    const align = placement.split('-')[1];
    if (base === 'bottom') { top = rect.bottom + window.scrollY + gap; }
    if (base === 'top')    { top = rect.top + window.scrollY - gap; }
    if (base === 'right')  { left = rect.right + window.scrollX + gap; top = rect.top + window.scrollY; }
    if (base === 'left')   { left = rect.left + window.scrollX - gap; top = rect.top + window.scrollY; }
    if (!align || align === 'start') { left = rect.left + window.scrollX; }
    if (align === 'end')   { left = rect.right + window.scrollX; }
    if (align === 'center' || (base === 'top' || base === 'bottom') && !align) { left = rect.left + window.scrollX + rect.width / 2; }
    setPos({ top, left });
  }, [placement]);

  useEffect(() => {
    if (!isOpen || !closeOnClickOutside) return;
    const handle = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !contentRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen, closeOnClickOutside, setOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isOpen, closeOnEsc, setOpen]);

  const handleToggle = () => { updatePosition(); setOpen(!isOpen); };

  return (
    <>
      {React.cloneElement(trigger, {
        ref: triggerRef,
        'aria-expanded': isOpen,
        'aria-haspopup': 'dialog' as const,
        'aria-controls': isOpen ? popoverId : undefined,
        onClick: (e: React.MouseEvent<HTMLElement>) => { handleToggle(); (trigger.props as React.HTMLAttributes<HTMLElement>).onClick?.(e); },
      })}
      {isOpen && (
        <Portal>
          <div
            ref={contentRef}
            id={popoverId}
            role="dialog"
            aria-modal="false"
            tabIndex={-1}
            className={cn('tokis-popover-content', className)}
            style={{ position: 'absolute', top: pos.top, left: pos.left }}
          >
            {title && <p className="tokis-popover-title">{title}</p>}
            <button className="tokis-popover-close" onClick={() => setOpen(false)} aria-label="Close">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}


