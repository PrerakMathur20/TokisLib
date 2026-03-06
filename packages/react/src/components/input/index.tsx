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
      className="tokis-input-password-toggle"
      onClick={() => setShowPassword((v) => !v)}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      tabIndex={-1}
    >
      {showPassword ? <EyeHideIcon /> : <EyeShowIcon />}
    </button>
  ) : null;

  return (
    <div className={cn('tokis-field', className)}>
      {label && (
        <label htmlFor={inputId} className={cn('tokis-label', required && 'tokis-label--required')}>
          {label}
        </label>
      )}
      <div className="tokis-input-wrapper">
        {startAdornment && (
          <span className="tokis-input-adornment tokis-input-adornment--start">{startAdornment}</span>
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
            'tokis-input',
            inputSize !== 'md' && `tokis-input--${inputSize}`,
            !!startAdornment && 'tokis-input--with-start',
            !!(endAdornment || passwordToggle) && 'tokis-input--with-end',
          )}
          {...props}
        />
        {passwordToggle}
        {endAdornment && (
          <span className="tokis-input-adornment tokis-input-adornment--end">{endAdornment}</span>
        )}
      </div>
      {helperText && (
        <span id={helperId} className={cn('tokis-helper-text', error && 'tokis-helper-text--error')}>
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
    <div className={cn('tokis-field', className)}>
      {label && (
        <label htmlFor={textareaId} className={cn('tokis-label', required && 'tokis-label--required')}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        required={required}
        aria-invalid={error || undefined}
        aria-describedby={helperId}
        className="tokis-textarea"
        {...props}
      />
      {helperText && (
        <span id={helperId} className={cn('tokis-helper-text', error && 'tokis-helper-text--error')}>
          {helperText}
        </span>
      )}
    </div>
  );
});
Textarea.displayName = 'Textarea';
