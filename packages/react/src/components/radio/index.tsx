import React, { useId } from 'react';
import { cn } from '../../utils/cn.js';

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  label?: string;
}

export interface RadioProps {
  value: string;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  checked?: boolean;
  name?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Radio({ value, label, description, disabled = false, checked = false, name, onChange, className }: RadioProps) {
  const autoId = useId();
  const radioId = `radio-${autoId}`;
  const descId = description ? `${radioId}-desc` : undefined;

  return (
    <label
      className={cn('synu-radio-root', className)}
      data-disabled={disabled || undefined}
      htmlFor={radioId}
    >
      <input
        type="radio"
        id={radioId}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(e) => e.target.checked && onChange?.(value)}
        className="synu-radio-native"
        aria-describedby={descId}
      />
      <span
        aria-hidden="true"
        className="synu-radio-control"
        data-checked={checked ? 'true' : undefined}
      />
      {(label || description) && (
        <div>
          {label && <span className="synu-radio-label">{label}</span>}
          {description && <p id={descId} className="synu-radio-description">{description}</p>}
        </div>
      )}
    </label>
  );
}

export function RadioGroup({ value, onChange, name, orientation = 'vertical', disabled = false, children, className, label }: RadioGroupProps) {
  const groupId = useId();
  return (
    <div
      role="radiogroup"
      aria-labelledby={label ? groupId : undefined}
      aria-disabled={disabled}
      className={cn('synu-radio-group', orientation === 'horizontal' && 'synu-radio-group--horizontal', className)}
    >
      {label && <span id={groupId} className="synu-label" style={{ marginBottom: 'var(--synu-spacing-1)' }}>{label}</span>}
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const item = child as React.ReactElement<RadioProps>;
        return React.cloneElement(item, {
          name: name ?? groupId,
          checked: value !== undefined ? item.props.value === value : item.props.checked,
          disabled: disabled || item.props.disabled,
          onChange: (v: string) => onChange?.(v),
        });
      })}
    </div>
  );
}
