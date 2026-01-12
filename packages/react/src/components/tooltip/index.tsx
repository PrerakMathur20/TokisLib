import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { cn } from '../../utils/cn.js';
import { Portal } from '../portal/index.js';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: TooltipPlacement;
  delay?: number;
  disabled?: boolean;
}

export function Tooltip({ content, children, placement = 'top', delay = 300, disabled = false }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const tooltipId = useId();

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const gap = 8;
      let top = 0; let left = 0;
      if (placement === 'top')    { top = rect.top + window.scrollY - gap; left = rect.left + window.scrollX + rect.width / 2; }
      if (placement === 'bottom') { top = rect.bottom + window.scrollY + gap; left = rect.left + window.scrollX + rect.width / 2; }
      if (placement === 'left')   { top = rect.top + window.scrollY + rect.height / 2; left = rect.left + window.scrollX - gap; }
      if (placement === 'right')  { top = rect.top + window.scrollY + rect.height / 2; left = rect.right + window.scrollX + gap; }
      setPos({ top, left });
      setVisible(true);
    }, delay);
  }, [delay, placement]);

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const transformMap: Record<TooltipPlacement, string> = {
    top: 'translateX(-50%) translateY(-100%)',
    bottom: 'translateX(-50%)',
    left: 'translateX(-100%) translateY(-50%)',
    right: 'translateY(-50%)',
  };

  return (
    <>
      {React.cloneElement(children, {
        ref: triggerRef,
        'aria-describedby': visible ? tooltipId : undefined,
        onMouseEnter: (...args: unknown[]) => { if (!disabled) show(); (children.props as React.HTMLAttributes<HTMLElement>).onMouseEnter?.(...(args as [React.MouseEvent<HTMLElement>])); },
        onMouseLeave: (...args: unknown[]) => { hide(); (children.props as React.HTMLAttributes<HTMLElement>).onMouseLeave?.(...(args as [React.MouseEvent<HTMLElement>])); },
        onFocus:      (...args: unknown[]) => { if (!disabled) show(); (children.props as React.HTMLAttributes<HTMLElement>).onFocus?.(...(args as [React.FocusEvent<HTMLElement>])); },
        onBlur:       (...args: unknown[]) => { hide(); (children.props as React.HTMLAttributes<HTMLElement>).onBlur?.(...(args as [React.FocusEvent<HTMLElement>])); },
      })}
      {visible && !disabled && (
        <Portal>
          <div
            id={tooltipId}
            role="tooltip"
            className="synu-tooltip-content"
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              transform: transformMap[placement],
              visibility: (pos.top === 0 && pos.left === 0) ? 'hidden' : undefined,
            }}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}

