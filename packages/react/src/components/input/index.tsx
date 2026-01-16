import React, { forwardRef, useId, useState } from 'react';
import { cn } from '../../utils/cn.js';

// ─── TextField ────────────────────────────────────────────

const EyeShowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M1 7s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const EyeHideIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M1 7s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M2 2l10 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
  required?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>((
  {
    label,
    helperText,
    error = false,
    startAdornment,
    endAdornment,
    inputSize = 'md',
    required,
    id,
    className,
    disabled,
    type,
    ...props
  },
  ref
) => {
  const autoId = useId();
  const inputId = id ?? `field-${autoId}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const passwordToggle = isPassword && !endAdornment ? (
    <button
      type="button"
      className="synu-input-password-toggle"
      onClick={() => setShowPassword((v) => !v)}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      tabIndex={-1}
    >
      {showPassword ? <EyeHideIcon /> : <EyeShowIcon />}
    </button>
  ) : null;

  return (
    <div className={cn('synu-field', className)}>
      {label && (
        <label htmlFor={inputId} className={cn('synu-label', required && 'synu-label--required')}>
          {label}
        </label>
      )}
      <div className="synu-input-wrapper">
        {startAdornment && (
          <span className="synu-input-adornment synu-input-adornment--start">{startAdornment}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          type={resolvedType}
          aria-invalid={error || undefined}
          aria-describedby={helperId}
          className={cn(
            'synu-input',
            inputSize !== 'md' && `synu-input--${inputSize}`,
            !!startAdornment && 'synu-input--with-start',
            !!(endAdornment || passwordToggle) && 'synu-input--with-end',
          )}
          {...props}
        />
        {passwordToggle}
        {endAdornment && (
          <span className="synu-input-adornment synu-input-adornment--end">{endAdornment}</span>
        )}
      </div>
      {helperText && (
        <span id={helperId} className={cn('synu-helper-text', error && 'synu-helper-text--error')}>
          {helperText}
        </span>
      )}
    </div>
  );
});
TextField.displayName = 'TextField';

// ─── Textarea ─────────────────────────────────────────────
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((
  { label, helperText, error = false, required, id, className, ...props },
  ref
) => {
  const autoId = useId();
  const textareaId = id ?? `textarea-${autoId}`;
  const helperId = helperText ? `${textareaId}-helper` : undefined;
  return (
    <div className={cn('synu-field', className)}>
      {label && (
        <label htmlFor={textareaId} className={cn('synu-label', required && 'synu-label--required')}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        required={required}
        aria-invalid={error || undefined}
        aria-describedby={helperId}
        className="synu-textarea"
        {...props}
      />
      {helperText && (
        <span id={helperId} className={cn('synu-helper-text', error && 'synu-helper-text--error')}>
          {helperText}
        </span>
      )}
    </div>
  );
});
Textarea.displayName = 'Textarea';
