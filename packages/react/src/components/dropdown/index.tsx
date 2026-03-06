import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn.js';
import { Portal } from '../portal/index.js';

export type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export interface DropdownProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
  placement?: DropdownPlacement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function computeDropdownPos(
  anchor: DOMRect,
  placement: DropdownPlacement,
): { top: number; left: number } {
  const gap = 4;
  switch (placement) {
    case 'bottom-start': return { top: anchor.bottom + gap, left: anchor.left };
    case 'bottom-end':   return { top: anchor.bottom + gap, left: anchor.right };
    case 'top-start':    return { top: anchor.top - gap,    left: anchor.left };
    case 'top-end':      return { top: anchor.top - gap,    left: anchor.right };
  }
}

const transformMap: Record<DropdownPlacement, string> = {
  'bottom-start': 'none',
  'bottom-end':   'translateX(-100%)',
  'top-start':    'translateY(-100%)',
  'top-end':      'translate(-100%, -100%)',
};

export function Dropdown({
  trigger,
  children,
  placement = 'bottom-start',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  className,
}: DropdownProps): JSX.Element {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const anchorRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback(
    (v: boolean) => {
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange],
  );

  const toggle = useCallback(() => {
    const next = !isOpen;
    if (next && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos(computeDropdownPos(rect, placement));
    }
    setOpen(next);
  }, [isOpen, placement, setOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onMouse = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onMouse);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onMouse);
    };
  }, [isOpen, setOpen]);

  return (
    <>
      {React.cloneElement(trigger, {
        ref: anchorRef,
        onClick: (...args: unknown[]) => {
          toggle();
          (trigger.props as React.HTMLAttributes<HTMLElement>).onClick?.(...(args as [React.MouseEvent<HTMLElement>]));
        },
        'aria-expanded': isOpen,
        'aria-haspopup': 'true',
      })}
      {isOpen && (
        <Portal>
          <div
            ref={menuRef}
            className={cn('tokis-dropdown', `tokis-dropdown--${placement}`, className)}
            style={{ position: 'fixed', top: pos.top, left: pos.left, transform: transformMap[placement] }}
          >
            {children}
          </div>
        </Portal>
      )}
    </>
  );
}

Dropdown.displayName = 'Dropdown';
