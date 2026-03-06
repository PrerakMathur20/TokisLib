import React, { forwardRef, useId, useCallback } from 'react';
import { cn } from '../../utils/cn.js';
import { useButton } from './useButton.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonRootProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render as a different element or component (polymorphic) */
  as?: React.ElementType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  iconOnly?: boolean;
  disabled?: boolean;
}

export const ButtonRoot = forwardRef<HTMLButtonElement, ButtonRootProps>(
  ({
    as: Component = 'button',
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    iconOnly = false,
    disabled = false,
    className,
    onClick,
    children,
    ...props
  }, ref) => {
    const { state, send } = useButton();
    const id = useId();
    const isNativeButton = Component === 'button';
    const isDisabled = disabled || loading;

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) return;
        send({ type: 'PRESS' });
        // Allow PRESS to register then immediately RELEASE for stateless click semantics
        send({ type: 'RELEASE' });
        onClick?.(e);
      },
      [isDisabled, onClick, send]
    );

    return (
      <Component
        ref={ref}
        id={id}
        disabled={isNativeButton ? isDisabled : undefined}
        aria-disabled={!isNativeButton && isDisabled ? true : undefined}
        aria-busy={loading || undefined}
        data-state={state.value}
        className={cn(
          'tokis-btn',
          `tokis-btn--${variant}`,
          size !== 'md' && `tokis-btn--${size}`,
          fullWidth && 'tokis-btn--full',
          loading && 'tokis-btn--loading',
          iconOnly && 'tokis-btn--icon-only',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {loading && <span className="tokis-spinner tokis-spinner--sm tokis-spinner--white" aria-hidden="true" />}
        {children}
      </Component>
    );
  }
);
ButtonRoot.displayName = 'ButtonRoot';
