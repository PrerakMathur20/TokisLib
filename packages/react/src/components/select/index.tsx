import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import { cn } from '../../utils/cn.js';
import { Portal } from '../portal/index.js';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  error?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Select({
  value, defaultValue, onChange, options, placeholder = 'Select an option',
  disabled = false, label, helperText, error = false, required,
  id, className, size = 'md',
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? `select-${autoId}`;
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  const currentValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find((o) => o.value === currentValue);
  const enabledOptions = options.filter((o) => !o.disabled);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX, width: rect.width });
  }, []);

  const handleSelect = (val: string) => {
    if (value === undefined) setInternalValue(val);
    onChange?.(val);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) { updatePosition(); setOpen(true); setFocusedIndex(0); return; }
      setFocusedIndex((prev) => {
        const next = e.key === 'ArrowDown' ? (prev + 1) % enabledOptions.length : (prev - 1 + enabledOptions.length) % enabledOptions.length;
        return next;
      });
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!open) { updatePosition(); setOpen(true); return; }
      if (focusedIndex >= 0) handleSelect(enabledOptions[focusedIndex].value);
    }
    if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
  };

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !contentRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const helperId = helperText ? `${selectId}-helper` : undefined;
  const groups = [...new Set(options.map((o) => o.group))];
  const hasGroups = groups.some(Boolean);

  return (
    <div className={cn('tokis-field', className)}>
      {label && (
        <label htmlFor={selectId} className={cn('tokis-label', required && 'tokis-label--required')}>{label}</label>
      )}
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-describedby={helperId}
        aria-invalid={error || undefined}
        aria-required={required}
        aria-disabled={disabled}
        className={cn('tokis-select-trigger', size !== 'md' && `tokis-select-trigger--${size}`)}
        data-open={open || undefined}
        data-disabled={disabled || undefined}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        onClick={() => { if (!disabled) { updatePosition(); setOpen((v) => !v); } }}
      >
        <span className={cn(!selectedOption && 'tokis-select-trigger__placeholder')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg className="tokis-select-trigger__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <Portal>
          <div
            ref={contentRef}
            role="listbox"
            aria-label={label}
            className="tokis-select-content"
            style={{ position: 'absolute', top: position.top, left: position.left, width: position.width }}
          >
            {hasGroups
              ? groups.map((group) => (
                  <div key={group ?? '__default__'}>
                    {group && <div className="tokis-select-group-label">{group}</div>}
                    {options.filter((o) => o.group === group).map((opt) => (
                      <SelectItem key={opt.value} opt={opt} currentValue={currentValue} onSelect={handleSelect} />
                    ))}
                  </div>
                ))
              : options.map((opt) => (
                  <SelectItem key={opt.value} opt={opt} currentValue={currentValue} onSelect={handleSelect} />
                ))
            }
          </div>
        </Portal>
      )}
      {helperText && (
        <span id={helperId} className={cn('tokis-helper-text', error && 'tokis-helper-text--error')}>{helperText}</span>
      )}
    </div>
  );
}

function SelectItem({ opt, currentValue, onSelect }: { opt: SelectOption; currentValue: string; onSelect: (v: string) => void }) {
  return (
    <div
      role="option"
      aria-selected={opt.value === currentValue}
      aria-disabled={opt.disabled}
      className="tokis-select-item"
      data-selected={opt.value === currentValue ? 'true' : undefined}
      data-disabled={opt.disabled ? 'true' : undefined}
      onClick={() => { if (!opt.disabled) onSelect(opt.value); }}
    >
      {opt.value === currentValue && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {opt.label}
    </div>
  );
}

