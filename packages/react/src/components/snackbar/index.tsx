import React, { useState, useCallback, useEffect, useId } from 'react';
import { cn } from '../../utils/cn.js';
import { Portal } from '../portal/index.js';

export type SnackbarVariant = 'default' | 'success' | 'error' | 'warning';
export type SnackbarPosition = 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-center';

export interface SnackbarItem {
  id: string;
  message: React.ReactNode;
  title?: React.ReactNode;
  variant?: SnackbarVariant;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

export interface SnackbarContainerProps {
  position?: SnackbarPosition;
  items: SnackbarItem[];
  onDismiss: (id: string) => void;
}

export function SnackbarContainer({ position = 'bottom-right', items, onDismiss }: SnackbarContainerProps) {
  const posClassMap: Record<SnackbarPosition, string> = {
    'bottom-right': '', 'bottom-left': 'tokis-snackbar-container--bottom-left',
    'bottom-center': 'tokis-snackbar-container--bottom-center',
    'top-right': 'tokis-snackbar-container--top-right',
    'top-center': 'tokis-snackbar-container--top-center',
  };

  return (
    <Portal>
      <div className={cn('tokis-snackbar-container', posClassMap[position])} aria-live="polite" aria-atomic="false">
        {items.map((item) => (
          <SnackbarToast key={item.id} item={item} onDismiss={onDismiss} />
        ))}
      </div>
    </Portal>
  );
}

function SnackbarToast({ item, onDismiss }: { item: SnackbarItem; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const duration = item.duration ?? 4000;
    if (duration === Infinity) return;
    const t = setTimeout(() => onDismiss(item.id), duration);
    return () => clearTimeout(t);
  }, [item.id, item.duration, onDismiss]);

  return (
    <div
      role="status"
      className={cn('tokis-snackbar', item.variant && item.variant !== 'default' && `tokis-snackbar--${item.variant}`)}
    >
      <div className="tokis-snackbar__body">
        {item.title && <div className="tokis-snackbar__title">{item.title}</div>}
        <div>{item.message}</div>
        {item.action && (
          <button className="tokis-snackbar__action" onClick={() => { item.action!.onClick(); onDismiss(item.id); }}>
            {item.action.label}
          </button>
        )}
      </div>
      <button className="tokis-snackbar__close" onClick={() => onDismiss(item.id)} aria-label="Dismiss">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

// ─── useSnackbar hook ─────────────────────────────────────
export function useSnackbar() {
  const [items, setItems] = useState<SnackbarItem[]>([]);

  const add = useCallback((item: Omit<SnackbarItem, 'id'>): string => {
    const id = `snackbar-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setItems((prev) => [...prev, { ...item, id }]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const dismissAll = useCallback(() => setItems([]), []);

  return { items, add, dismiss, dismissAll };
}

