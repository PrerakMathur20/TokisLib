import React from 'react';
import { cn } from '../../utils/cn.js';

// ─── ToggleButton ─────────────────────────────────────────

export interface ToggleButtonProps {
  pressed: boolean;
  onChange: (pressed: boolean) => void;
  children: React.ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'aria-label'?: string;
}

export function ToggleButton({
  pressed,
  onChange,
  children,
  disabled = false,
  size = 'md',
  className,
  'aria-label': ariaLabel,
}: ToggleButtonProps): JSX.Element {
  return (
    <button
      type="button"
      className={cn('tokis-toggle', `tokis-toggle--${size}`, pressed && 'tokis-toggle--pressed', className)}
      aria-pressed={pressed}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!pressed)}
    >
      {children}
    </button>
  );
}

ToggleButton.displayName = 'ToggleButton';

// ─── ToggleGroup ──────────────────────────────────────────

export interface ToggleGroupOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  options: ToggleGroupOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ToggleGroup({
  options,
  value,
  onChange,
  multiple = false,
  size = 'md',
  className,
}: ToggleGroupProps): JSX.Element {
  const isSelected = (v: string) =>
    multiple ? (value as string[]).includes(v) : value === v;

  const handleClick = (v: string) => {
    if (multiple) {
      const arr = value as string[];
      if (arr.includes(v)) {
        onChange(arr.filter((x) => x !== v));
      } else {
        onChange([...arr, v]);
      }
    } else {
      onChange(v);
    }
  };

  return (
    <div
      className={cn('tokis-toggle-group', className)}
      role={multiple ? 'group' : 'radiogroup'}
      aria-label="Toggle group"
    >
      {options.map((opt) => {
        const selected = isSelected(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            className={cn('tokis-toggle-group__item', `tokis-toggle-group__item--${size}`, selected && 'tokis-toggle-group__item--active')}
            role={multiple ? 'checkbox' : 'radio'}
            aria-checked={selected}
            disabled={opt.disabled}
            onClick={() => handleClick(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

ToggleGroup.displayName = 'ToggleGroup';
