import React, { useRef, useEffect, useId } from 'react';
import { cn } from '../../utils/cn.js';

export interface CheckboxProps {
  label?: React.ReactNode;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  id?: string;
  name?: string;
  value?: string;
  className?: string;
  'aria-label'?: string;
}

export function Checkbox({
  label, description, checked, defaultChecked, indeterminate = false,
  disabled = false, onChange, id, name, value, className, 'aria-label': ariaLabel,
}: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? `checkbox-${autoId}`;
  const descId = description ? `${inputId}-desc` : undefined;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={cn('tokis-checkbox-root', className)}
      data-disabled={disabled || undefined}
      htmlFor={inputId}
    >
      <input
        ref={inputRef}
        type="checkbox"
        id={inputId}
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={(e) => { if (!disabled) onChange?.(e.target.checked); }}
        className="tokis-checkbox-native"
        aria-label={!label ? ariaLabel : undefined}
        aria-describedby={descId}
      />
      <span
        aria-hidden="true"
        className="tokis-checkbox-control"
        data-checked={checked && !indeterminate ? 'true' : undefined}
        data-indeterminate={indeterminate ? 'true' : undefined}
      />
      {(label || description) && (
        <div>
          {label && <span className="tokis-checkbox-label">{label}</span>}
          {description && <p id={descId} className="tokis-checkbox-description">{description}</p>}
        </div>
      )}
    </label>
  );
}
