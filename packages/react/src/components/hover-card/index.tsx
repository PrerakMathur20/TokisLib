import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '../../utils/cn.js';
import { Portal } from '../portal/index.js';

export interface HoverCardProps {
  trigger: React.ReactElement;
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  openDelay?: number;
  closeDelay?: number;
  className?: string;
}

function computePosition(
  anchor: DOMRect,
  placement: 'top' | 'bottom' | 'left' | 'right',
): { top: number; left: number } {
  const gap = 8;
  switch (placement) {
    case 'top':    return { top: anchor.top - gap,          left: anchor.left + anchor.width / 2 };
    case 'bottom': return { top: anchor.bottom + gap,       left: anchor.left + anchor.width / 2 };
    case 'left':   return { top: anchor.top + anchor.height / 2, left: anchor.left - gap };
    case 'right':  return { top: anchor.top + anchor.height / 2, left: anchor.right + gap };
  }
}

export function HoverCard({
  trigger,
  content,
  placement = 'bottom',
  openDelay = 300,
  closeDelay = 200,
  className,
}: HoverCardProps): JSX.Element {
  const [visible, setVisible] = useState(false);
  const [positioned, setPositioned] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const anchorRef = useRef<HTMLElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback(() => {
    clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      setPos(computePosition(rect, placement));
      setVisible(true);
      requestAnimationFrame(() => setPositioned(true));
    }, openDelay);
  }, [openDelay, placement]);

  const hide = useCallback(() => {
    clearTimeout(openTimer.current);
    setPositioned(false);
    closeTimer.current = setTimeout(() => setVisible(false), closeDelay);
  }, [closeDelay]);

  useEffect(() => () => { clearTimeout(openTimer.current); clearTimeout(closeTimer.current); }, []);

  const transformMap = {
    top: 'translateX(-50%) translateY(-100%)',
    bottom: 'translateX(-50%)',
    left: 'translateX(-100%) translateY(-50%)',
    right: 'translateY(-50%)',
  };

  return (
    <>
      {React.cloneElement(trigger, {
        ref: anchorRef,
        onMouseEnter: (...args: unknown[]) => {
          show();
          (trigger.props as React.HTMLAttributes<HTMLElement>).onMouseEnter?.(...(args as [React.MouseEvent<HTMLElement>]));
        },
        onMouseLeave: (...args: unknown[]) => {
          hide();
          (trigger.props as React.HTMLAttributes<HTMLElement>).onMouseLeave?.(...(args as [React.MouseEvent<HTMLElement>]));
        },
        onFocus: (...args: unknown[]) => {
          show();
          (trigger.props as React.HTMLAttributes<HTMLElement>).onFocus?.(...(args as [React.FocusEvent<HTMLElement>]));
        },
        onBlur: (...args: unknown[]) => {
          hide();
          (trigger.props as React.HTMLAttributes<HTMLElement>).onBlur?.(...(args as [React.FocusEvent<HTMLElement>]));
        },
      })}
      {visible && (
        <Portal>
          <div
            className={cn('synu-hover-card', `synu-hover-card--${placement}`, className)}
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              transform: transformMap[placement],
              opacity: positioned ? undefined : 0,
              pointerEvents: positioned ? undefined : 'none',
            }}
            onMouseEnter={() => clearTimeout(closeTimer.current)}
            onMouseLeave={hide}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}

HoverCard.displayName = 'HoverCard';
