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

interface TooltipState {
  visible: boolean;
  top: number;
  left: number;
  placement: TooltipPlacement;
}

export function Tooltip({ content, children, placement = 'top', delay = 300, disabled = false }: TooltipProps) {
  const [state, setState] = useState<TooltipState>({ visible: false, top: 0, left: 0, placement });
  const triggerRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const tooltipId = useId();

  // When placement prop changes and tooltip is visible, recompute
  useEffect(() => {
    if (state.visible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const { top, left } = computePosition(rect, placement);
      setState((prev) => ({ ...prev, top, left, placement }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement]);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const { top, left } = computePosition(rect, placement);
      // Single atomic state update — position + visible at once
      setState({ visible: true, top, left, placement });
    }, delay);
  }, [delay, placement]);

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const transformMap: Record<TooltipPlacement, string> = {
    top:    'translateX(-50%) translateY(-100%)',
    bottom: 'translateX(-50%)',
    left:   'translateX(-100%) translateY(-50%)',
    right:  'translateY(-50%)',
  };

  return (
    <>
      {React.cloneElement(children, {
        ref: triggerRef,
        'aria-describedby': state.visible ? tooltipId : undefined,
        onMouseEnter: (...args: unknown[]) => {
          if (!disabled) show();
          (children.props as React.HTMLAttributes<HTMLElement>).onMouseEnter?.(...(args as [React.MouseEvent<HTMLElement>]));
        },
        onMouseLeave: (...args: unknown[]) => {
          hide();
          (children.props as React.HTMLAttributes<HTMLElement>).onMouseLeave?.(...(args as [React.MouseEvent<HTMLElement>]));
        },
        onFocus: (...args: unknown[]) => {
          if (!disabled) show();
          (children.props as React.HTMLAttributes<HTMLElement>).onFocus?.(...(args as [React.FocusEvent<HTMLElement>]));
        },
        onBlur: (...args: unknown[]) => {
          hide();
          (children.props as React.HTMLAttributes<HTMLElement>).onBlur?.(...(args as [React.FocusEvent<HTMLElement>]));
        },
      })}
      {state.visible && !disabled && (
        <Portal>
          <div
            id={tooltipId}
            role="tooltip"
            className={cn('tokis-tooltip-content', `tokis-tooltip-content--${state.placement}`)}
            style={{
              position: 'fixed',
              top: state.top,
              left: state.left,
              transform: transformMap[state.placement],
            }}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}

function computePosition(rect: DOMRect, placement: TooltipPlacement): { top: number; left: number } {
  const gap = 8;
  switch (placement) {
    case 'top':
      return { top: rect.top - gap, left: rect.left + rect.width / 2 };
    case 'bottom':
      return { top: rect.bottom + gap, left: rect.left + rect.width / 2 };
    case 'left':
      return { top: rect.top + rect.height / 2, left: rect.left - gap };
    case 'right':
      return { top: rect.top + rect.height / 2, left: rect.right + gap };
  }
}
