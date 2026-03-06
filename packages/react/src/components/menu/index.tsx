import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import { cn } from '../../utils/cn.js';
import { Portal } from '../portal/index.js';

export interface MenuItem {
  type?: 'item' | 'separator' | 'label';
  label?: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  items?: MenuItem[]; // sub-menu
}

export interface MenuProps {
  trigger: React.ReactElement;
  items: MenuItem[];
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  className?: string;
}

export function Menu({ trigger, items, placement = 'bottom-start', className }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const isBottom = placement.startsWith('bottom');
    const isStart = placement.endsWith('start');
    setPos({
      top: isBottom ? rect.bottom + window.scrollY + 4 : rect.top + window.scrollY - 4,
      left: isStart ? rect.left + window.scrollX : rect.right + window.scrollX,
    });
  }, [placement]);

  const clickableItems = items.filter((i) => i.type !== 'separator' && i.type !== 'label' && !i.disabled);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !contentRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
    };
    document.addEventListener('mousedown', handle);
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('mousedown', handle); document.removeEventListener('keydown', handleKey); };
  }, [open]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); updatePosition(); setOpen(true); setFocusedIndex(0);
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIndex((p) => (p + 1) % clickableItems.length); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setFocusedIndex((p) => (p - 1 + clickableItems.length) % clickableItems.length); }
    if (e.key === 'Enter' && focusedIndex >= 0) { clickableItems[focusedIndex].onClick?.(); setOpen(false); }
  };

  let clickableIdx = -1;
  return (
    <>
      {React.cloneElement(trigger, {
        ref: triggerRef,
        'aria-haspopup': 'menu' as const,
        'aria-expanded': open,
        'aria-controls': open ? menuId : undefined,
        onClick: (e: React.MouseEvent<HTMLElement>) => { updatePosition(); setOpen((v) => !v); (trigger.props as React.HTMLAttributes<HTMLElement>).onClick?.(e); },
        onKeyDown: handleTriggerKeyDown,
      })}
      {open && (
        <Portal>
          <div
            ref={contentRef}
            id={menuId}
            role="menu"
            tabIndex={-1}
            className={cn('tokis-menu-content', className)}
            style={{ position: 'absolute', top: pos.top, left: pos.left, ...(placement.endsWith('end') && { transform: 'translateX(-100%)' }) }}
            onKeyDown={handleMenuKeyDown}
          >
            {items.map((item, i) => {
              if (item.type === 'separator') return <div key={i} className="tokis-menu-separator" role="separator" />;
              if (item.type === 'label') return <div key={i} className="tokis-menu-group-label">{item.label}</div>;
              clickableIdx++;
              const isFocused = clickableIdx === focusedIndex;
              const idx = clickableIdx;
              return (
                <button
                  key={i}
                  role="menuitem"
                  className={cn('tokis-menu-item', item.destructive && 'tokis-menu-item--destructive')}
                  data-focused={isFocused ? 'true' : undefined}
                  data-disabled={item.disabled ? 'true' : undefined}
                  aria-disabled={item.disabled}
                  disabled={item.disabled}
                  tabIndex={isFocused ? 0 : -1}
                  onClick={() => { if (!item.disabled) { item.onClick?.(); setOpen(false); } }}
                  onMouseEnter={() => setFocusedIndex(idx)}
                >
                  {item.icon && <span className="tokis-menu-item__icon" aria-hidden="true">{item.icon}</span>}
                  <span className="tokis-menu-item__label">{item.label}</span>
                  {item.shortcut && <span className="tokis-menu-item__shortcut" aria-label={`keyboard shortcut: ${item.shortcut}`}>{item.shortcut}</span>}
                </button>
              );
            })}
          </div>
        </Portal>
      )}
    </>
  );
}


