import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn.js';
import { Portal } from '../portal/index.js';

export interface ContextMenuItem {
  type: 'item' | 'separator' | 'label';
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactElement;
  className?: string;
}

export function ContextMenu({ items, children, className }: ContextMenuProps): JSX.Element {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setVisible(false), []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [visible, close]);

  useEffect(() => {
    if (!visible || !menuRef.current) return;
    menuRef.current.focus();
  }, [visible]);

  return (
    <>
      {React.cloneElement(children, { onContextMenu: handleContextMenu })}
      {visible && (
        <Portal>
          <div
            ref={menuRef}
            className={cn('tokis-context-menu', className)}
            role="menu"
            tabIndex={-1}
            style={{ position: 'fixed', top: pos.y, left: pos.x }}
          >
            {items.map((item, i) => {
              if (item.type === 'separator') {
                return <div key={i} className="tokis-context-menu__separator" role="separator" />;
              }
              if (item.type === 'label') {
                return <div key={i} className="tokis-context-menu__label">{item.label}</div>;
              }
              return (
                <button
                  key={i}
                  role="menuitem"
                  className={cn(
                    'tokis-context-menu__item',
                    item.destructive && 'tokis-context-menu__item--destructive',
                    item.disabled && 'tokis-context-menu__item--disabled',
                  )}
                  disabled={item.disabled}
                  onClick={() => { item.onClick?.(); close(); }}
                >
                  {item.icon && <span className="tokis-context-menu__icon" aria-hidden="true">{item.icon}</span>}
                  {item.label}
                </button>
              );
            })}
          </div>
        </Portal>
      )}
    </>
  );
}

ContextMenu.displayName = 'ContextMenu';
