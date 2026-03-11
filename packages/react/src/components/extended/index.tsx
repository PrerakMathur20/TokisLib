import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { trapFocus } from '@tokis/core';
import { cn } from '../../utils/cn.js';
import { TextField } from '../input/index.js';
import { ButtonRoot } from '../button/index.js';
import { Portal } from '../portal/index.js';
import { Card, CardBody, CardHeader } from '../card/index.js';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '../table/index.js';

export interface AutocompleteOption {
  value: string;
  label: string;
}

export interface AutocompleteProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  options: AutocompleteOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
}

export function Autocomplete({ options, value, onChange, label, placeholder = 'Search...', ...props }: AutocompleteProps) {
  const [query, setQuery] = useState(value ?? '');
  const [open, setOpen] = useState(false);
  const filtered = useMemo(() => options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())), [options, query]);

  return (
    <div className="tokis-autocomplete">
      <TextField
        label={label}
        value={query}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange?.(e.target.value);
          setOpen(true);
        }}
        {...props}
      />
      {open && filtered.length > 0 && (
        <div className="tokis-autocomplete-list" role="listbox">
          {filtered.map((option) => (
            <button
              key={option.value}
              type="button"
              className="tokis-autocomplete-item"
              onClick={() => {
                setQuery(option.label);
                onChange?.(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export function ButtonGroup({ orientation = 'horizontal', className, ...props }: ButtonGroupProps) {
  return <div className={cn('tokis-button-group', orientation === 'vertical' && 'tokis-button-group--vertical', className)} {...props} />;
}

export interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function FloatingActionButton({ children, label = 'Action', className, ...props }: FloatingActionButtonProps) {
  return (
    <ButtonRoot className={cn('tokis-fab', className)} iconOnly aria-label={label} {...props}>
      {children}
    </ButtonRoot>
  );
}

export interface NumberFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string;
  value?: number;
  onChange?: (value: number) => void;
}

export function NumberField({ label, value = 0, onChange, step = 1, min, max, ...props }: NumberFieldProps) {
  const parsedStep = Number(step) || 1;
  const minNum = typeof min === 'number' ? min : undefined;
  const maxNum = typeof max === 'number' ? max : undefined;

  const update = (next: number) => {
    const boundedMin = minNum !== undefined ? Math.max(minNum, next) : next;
    const bounded = maxNum !== undefined ? Math.min(maxNum, boundedMin) : boundedMin;
    onChange?.(bounded);
  };

  return (
    <div className="tokis-number-field">
      <TextField
        {...props}
        type="number"
        label={label}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
      />
      <div className="tokis-number-field-actions">
        <ButtonRoot size="sm" variant="outline" onClick={() => update(value - parsedStep)}>-</ButtonRoot>
        <ButtonRoot size="sm" variant="outline" onClick={() => update(value + parsedStep)}>+</ButtonRoot>
      </div>
    </div>
  );
}

export interface RatingProps {
  value?: number;
  max?: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function Rating({ value = 0, max = 5, readOnly = false, onChange, size = 'md', label = 'Rating' }: RatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  const sizeMap = { sm: '18px', md: '24px', lg: '32px' };

  return (
    <div
      className={cn('tokis-rating', readOnly && 'tokis-rating--readonly')}
      role="radiogroup"
      aria-label={label}
      data-readonly={readOnly || undefined}
    >
      {Array.from({ length: max }).map((_, index) => {
        const current = index + 1;
        const filled = current <= display;
        return (
          <button
            key={current}
            type="button"
            role="radio"
            aria-checked={current <= value}
            aria-label={`${current} star${current !== 1 ? 's' : ''}`}
            disabled={readOnly}
            className={cn(
              'tokis-rating-star',
              filled && 'tokis-rating-star--active',
              hovered !== null && filled && 'tokis-rating-star--hover',
            )}
            style={{ fontSize: sizeMap[size] }}
            onClick={() => onChange?.(current)}
            onMouseEnter={() => !readOnly && setHovered(current)}
            onMouseLeave={() => !readOnly && setHovered(null)}
          >
            <svg
              viewBox="0 0 24 24"
              width={sizeMap[size]}
              height={sizeMap[size]}
              aria-hidden="true"
              fill={filled ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

// Alias with more semantic name
export { Rating as StarRating };

export interface TransferItem {
  id: string;
  label: string;
}

export interface TransferListProps {
  left: TransferItem[];
  right: TransferItem[];
  onChange: (left: TransferItem[], right: TransferItem[]) => void;
  leftTitle?: string;
  rightTitle?: string;
}

export function TransferList({ left, right, onChange, leftTitle = 'Available', rightTitle = 'Selected' }: TransferListProps) {
  const [leftChecked, setLeftChecked] = useState<string[]>([]);
  const [rightChecked, setRightChecked] = useState<string[]>([]);

  const moveToRight = () => {
    const moved = left.filter((item) => leftChecked.includes(item.id));
    onChange(left.filter((item) => !leftChecked.includes(item.id)), [...right, ...moved]);
    setLeftChecked([]);
  };

  const moveToLeft = () => {
    const moved = right.filter((item) => rightChecked.includes(item.id));
    onChange([...left, ...moved], right.filter((item) => !rightChecked.includes(item.id)));
    setRightChecked([]);
  };

  const renderPane = (title: string, items: TransferItem[], checked: string[], setChecked: (ids: string[]) => void) => (
    <Card className="tokis-transfer-pane">
      <CardHeader>{title}</CardHeader>
      <CardBody>
        {items.map((item) => (
          <label key={item.id} className="tokis-transfer-item">
            <input
              type="checkbox"
              checked={checked.includes(item.id)}
              onChange={(e) => setChecked(e.target.checked ? [...checked, item.id] : checked.filter((id) => id !== item.id))}
            />
            {item.label}
          </label>
        ))}
      </CardBody>
    </Card>
  );

  return (
    <div className="tokis-transfer-list">
      {renderPane(leftTitle, left, leftChecked, setLeftChecked)}
      <div className="tokis-transfer-actions">
        <ButtonRoot size="sm" onClick={moveToRight}>{'>'}</ButtonRoot>
        <ButtonRoot size="sm" onClick={moveToLeft}>{'<'}</ButtonRoot>
      </div>
      {renderPane(rightTitle, right, rightChecked, setRightChecked)}
    </div>
  );
}

// ToggleButton and ToggleGroup are in components/toggle/index.tsx

// Icon components have moved to @tokis/icons.
// These deprecated stubs remain for backwards compatibility.

/** @deprecated Import named icons from `@tokis/icons` instead. */
export interface EmojiIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: 'search' | 'close' | 'menu' | 'check' | 'star' | 'arrow-right';
}

const _emojiIconMap: Record<EmojiIconProps['name'], string> = {
  search: '⌕', close: '×', menu: '☰', check: '✓', star: '★', 'arrow-right': '→',
};

/** @deprecated Use named SVG icons from `@tokis/icons`. */
export function Icon({ name, className, ...props }: EmojiIconProps) {
  return <span className={cn('tokis-icon', className)} aria-hidden="true" {...props}>{_emojiIconMap[name]}</span>;
}

export interface BackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClick?: () => void;
}

export function Backdrop({ open, onClick, className, children, ...props }: BackdropProps) {
  if (!open) return null;
  return (
    <div className={cn('tokis-backdrop', className)} onClick={onClick} {...props}>
      {children}
    </div>
  );
}

// AppBar is in components/app-bar/index.tsx

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 0 | 1 | 2 | 3;
}

export function Paper({ elevation = 1, className, ...props }: PaperProps) {
  return <div className={cn('tokis-paper', `tokis-paper--${elevation}`, className)} {...props} />;
}

// BottomNavigation is in components/bottom-nav/index.tsx

export interface SpeedDialAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface SpeedDialProps {
  label?: string;
  actions: SpeedDialAction[];
}

export function SpeedDial({ label = 'Open actions', actions }: SpeedDialProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="tokis-speed-dial">
      {open && (
        <div className="tokis-speed-dial-actions">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="tokis-speed-dial-action"
              onClick={() => {
                action.onClick?.();
                setOpen(false);
              }}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
      <FloatingActionButton label={label} onClick={() => setOpen((state) => !state)}>+</FloatingActionButton>
    </div>
  );
}

// Stepper is in components/stepper/index.tsx

export interface ImageListProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number;
}

export function ImageList({ cols = 3, className, style, ...props }: ImageListProps) {
  return <div className={cn('tokis-image-list', className)} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, ...style }} {...props} />;
}

export function ImageListItem(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="tokis-image-list-item" {...props} />;
}

export interface ClickAwayListenerProps {
  onClickAway: () => void;
  children: React.ReactElement;
}

export function ClickAwayListener({ onClickAway, children }: ClickAwayListenerProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClickAway();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClickAway]);

  return React.cloneElement(children, {
    ref: (node: HTMLElement) => {
      ref.current = node;
    },
  });
}

// ─── OTP Input ──────────────────────────────────────────────

export interface OtpInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  label?: string;
}

export function OtpInput({ length = 6, value = '', onChange, disabled = false, error = false, label }: OtpInputProps) {
  const digits = value.slice(0, length).padEnd(length, '').split('');
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, char: string) => {
    const filtered = char.replace(/\D/g, '').slice(0, 1);
    const next = digits.map((d, i) => (i === index ? filtered : d)).join('').trimEnd();
    onChange?.(next);
    if (filtered && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
      const next = digits.map((d, i) => (i === index - 1 ? '' : d)).join('').trimEnd();
      onChange?.(next);
    }
    if (e.key === 'ArrowLeft' && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange?.(pasted);
    const focusIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="tokis-otp-root">
      {label && <label className="tokis-label" style={{ marginBottom: 'var(--tokis-spacing-2)', display: 'block' }}>{label}</label>}
      <div className="tokis-otp-inputs" aria-label={label ?? 'OTP Input'}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputsRef.current[index] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit.trim()}
            disabled={disabled}
            className={cn('tokis-otp-cell', error && 'tokis-otp-cell--error', digit.trim() && 'tokis-otp-cell--filled')}
            aria-label={`Digit ${index + 1} of ${length}`}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
    </div>
  );
}

// ─── File Drop Zone ──────────────────────────────────────────

export interface FileDropZoneProps {
  onFiles?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  hint?: string;
  maxSize?: number; // bytes
}

export function FileDropZone({
  onFiles,
  accept,
  multiple = false,
  disabled = false,
  label = 'Drop files here or click to upload',
  hint,
  maxSize,
}: FileDropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const process = (incoming: FileList | null) => {
    if (!incoming) return;
    const arr = Array.from(incoming);
    if (maxSize) {
      const oversized = arr.find((f) => f.size > maxSize);
      if (oversized) {
        setError(`File "${oversized.name}" exceeds the ${Math.round(maxSize / 1024)}KB limit.`);
        return;
      }
    }
    setError(null);
    setFiles(arr);
    onFiles?.(arr);
  };

  return (
    <div
      className={cn('tokis-dropzone', dragging && 'tokis-dropzone--dragging', disabled && 'tokis-dropzone--disabled', error && 'tokis-dropzone--error')}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); }}}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) process(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => process(e.target.files)}
      />
      <div className="tokis-dropzone__icon" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M6 22v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 6v14M10 12l6-6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="tokis-dropzone__label">{label}</div>
      {hint && !files.length && <div className="tokis-dropzone__hint">{hint}</div>}
      {error && <div className="tokis-dropzone__error">{error}</div>}
      {files.length > 0 && !error && (
        <div className="tokis-dropzone__files">
          {files.map((f) => (
            <span key={f.name} className="tokis-dropzone__file">{f.name}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export function CssBaseline() {
  return (
    <style>{`*, *::before, *::after { box-sizing: border-box; } body { margin: 0; min-height: 100vh; }`}</style>
  );
}

export function InitColorSchemeScript() {
  const script = `(() => {
    const stored = localStorage.getItem('tokis-theme');
    const mode = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', mode);
  })();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Accessible title for the modal (wired to aria-labelledby). */
  title?: string;
  /** Accessible description (wired to aria-describedby). */
  description?: string;
  /** Close when the backdrop is clicked. @default true */
  closeOnBackdropClick?: boolean;
  /** Close on Escape key. @default true */
  closeOnEscape?: boolean;
}

export function Modal({
  open,
  onClose,
  children,
  title,
  description,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  // Lock scroll on open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Trap focus when open
  useEffect(() => {
    if (!open || !contentRef.current) return;
    previousFocusRef.current = document.activeElement as HTMLElement;
    const release = trapFocus(contentRef.current);
    return () => {
      release?.();
      previousFocusRef.current?.focus();
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, closeOnEscape, onClose]);

  if (!open) return null;

  return (
    <Portal>
      <div
        className="tokis-modal-root"
        role="presentation"
        onClick={closeOnBackdropClick ? onClose : undefined}
      >
        <div
          ref={contentRef}
          className="tokis-modal-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          onClick={(e) => e.stopPropagation()}
        >
          {title && <span id={titleId} className="tokis-modal-title">{title}</span>}
          {description && <span id={descriptionId} className="tokis-modal-desc">{description}</span>}
          {children}
        </div>
      </div>
    </Portal>
  );
}

export interface NoSsrProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function NoSsr({ children, fallback = null }: NoSsrProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children : fallback}</>;
}

export interface PopperProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  children: React.ReactNode;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

export function Popper({ anchorEl, open, children, placement = 'bottom-start' }: PopperProps) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!anchorEl || !open) return;
    const rect = anchorEl.getBoundingClientRect();
    const isBottom = placement.startsWith('bottom');
    setPos({
      top: (isBottom ? rect.bottom : rect.top) + window.scrollY + (isBottom ? 8 : -8),
      left: (placement.endsWith('start') ? rect.left : rect.right) + window.scrollX,
    });
  }, [anchorEl, open, placement]);

  if (!open) return null;

  return (
    <Portal>
      <div className="tokis-popper" style={{ top: pos.top, left: pos.left }}>
        {children}
      </div>
    </Portal>
  );
}

export interface TextareaAutosizeProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
  maxRows?: number;
}

export function TextareaAutosize({ minRows = 3, maxRows = 8, onChange, ...props }: TextareaAutosizeProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    if (!ref.current) return;
    ref.current.style.height = 'auto';
    const rowHeight = 24;
    const minHeight = minRows * rowHeight;
    const maxHeight = maxRows * rowHeight;
    ref.current.style.height = `${Math.min(maxHeight, Math.max(minHeight, ref.current.scrollHeight))}px`;
  };

  useEffect(() => {
    resize();
  }, []);

  return (
    <textarea
      ref={ref}
      className="tokis-textarea tokis-textarea-autosize"
      onChange={(event) => {
        resize();
        onChange?.(event);
      }}
      {...props}
    />
  );
}

export interface FadeProps {
  in: boolean;
  children: React.ReactNode;
}

export function Fade({ in: visible, children }: FadeProps) {
  return <div className={cn('tokis-fade', visible && 'tokis-fade--in')}>{children}</div>;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// DataGrid has been moved to components/datagrid/index.tsx
// Import it from '@tokis/react' directly or from 'packages/react/src/components/datagrid'.

// DatePicker, TimePicker, DateTimePicker have moved to components/datepicker/index.tsx
// Import them from '@tokis/react' directly.

export interface ChartsProps {
  data: number[];
  labels?: string[];
}

export function Charts({ data, labels = [] }: ChartsProps) {
  const max = Math.max(...data, 1);
  return (
    <div className="tokis-chart" role="img" aria-label="Bar chart">
      {data.map((value, index) => (
        <div key={index} className="tokis-chart-bar-wrap">
          <div className="tokis-chart-bar" style={{ height: `${(value / max) * 100}%` }} title={`${labels[index] ?? index}: ${value}`} />
          <span className="tokis-chart-label">{labels[index] ?? index + 1}</span>
        </div>
      ))}
    </div>
  );
}

// TreeView is in components/treeview/index.tsx
