import React, { useId, useCallback } from 'react';
import { cn } from '../../utils/cn.js';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  id?: string;
  name?: string;
  className?: string;
  'aria-label'?: string;
}

export function Switch({ checked, defaultChecked, onChange, label, description, disabled = false, size = 'md', id, name, className, 'aria-label': ariaLabel }: SwitchProps) {
  const autoId = useId();
  const switchId = id ?? `switch-${autoId}`;
  const descId = description ? `${switchId}-desc` : undefined;

  const toggle = useCallback(() => {
    if (!disabled) onChange?.(!checked);
  }, [checked, disabled, onChange]);

  return (
    <div className={cn('synu-switch-root', size === 'sm' && 'synu-switch-root--sm', className)} data-disabled={disabled || undefined}>
      <div
        role="switch"
        tabIndex={disabled ? -1 : 0}
        aria-checked={checked ?? false}
        aria-label={ariaLabel}
        aria-labelledby={label ? switchId : undefined}
        aria-describedby={descId}
        aria-disabled={disabled}
        className="synu-switch-track"
        data-checked={checked ? 'true' : undefined}
        onClick={toggle}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } }}
      >
        <span className="synu-switch-thumb" />
      </div>
      {(label || description) && (
        <div className="synu-switch-content" onClick={toggle} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
          {label && <label id={switchId} className="synu-switch-label">{label}</label>}
          {description && <p id={descId} className="synu-switch-description">{description}</p>}
        </div>
      )}
      <input type="checkbox" role="none" name={name} checked={checked} defaultChecked={defaultChecked} disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} aria-hidden="true" tabIndex={-1} />
    </div>
  );
}

