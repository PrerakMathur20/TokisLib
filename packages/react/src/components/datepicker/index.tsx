/**
 * DatePicker, TimePicker, DateTimePicker
 *
 * All three share a pattern: a trigger input that opens a Portal-mounted popup.
 * DatePicker uses the Calendar grid widget.
 * TimePicker uses scroll-select columns for hours/minutes.
 * DateTimePicker combines both.
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { Portal } from '../portal/index.js';
import { useId } from '../../hooks/useId.js';
import { cn } from '../../utils/cn.js';
import { Calendar, type CalendarProps } from './Calendar.js';
import {
  parseDate,
  formatDisplayDate,
  parseTime,
  formatTime,
} from './date-utils.js';

// ─── Shared floating panel hook ───────────────────────────────────────────────

function useFloatingPanel(onClose?: () => void) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePos = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
    });
  }, []);

  const openPanel = () => {
    updatePos();
    setOpen(true);
  };

  const closePanel = useCallback(() => {
    setOpen(false);
    onClose?.();
    triggerRef.current?.focus();
  }, [onClose]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: globalThis.MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      ) {
        closePanel();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, closePanel]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') closePanel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, closePanel]);

  return { open, openPanel, closePanel, triggerRef, panelRef, pos };
}

// ─── DatePicker ──────────────────────────────────────────────────────────────

export interface DatePickerProps extends Pick<CalendarProps, 'min' | 'max'> {
  /** Controlled value (YYYY-MM-DD). */
  value?: string;
  /** Default value for uncontrolled usage (YYYY-MM-DD). */
  defaultValue?: string;
  /** Fires with a YYYY-MM-DD string or undefined when cleared. */
  onChange?: (value: string | undefined) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  /** Additional CSS class on the root element. */
  className?: string;
}

export function DatePicker({
  value: valueProp,
  defaultValue,
  onChange,
  label,
  placeholder = 'Pick a date',
  disabled = false,
  required = false,
  error = false,
  min,
  max,
  className,
}: DatePickerProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;
  const id = useId('datepicker');
  const parsedDate = parseDate(value);

  const { open, openPanel, closePanel, triggerRef, panelRef, pos } = useFloatingPanel();

  const handleSelect = (iso: string) => {
    if (valueProp === undefined) setInternalValue(iso);
    onChange?.(iso);
    closePanel();
  };

  const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (valueProp === undefined) setInternalValue(undefined);
    onChange?.(undefined);
  };

  return (
    <div className={cn('tokis-datepicker', error && 'tokis-datepicker--error', disabled && 'tokis-datepicker--disabled', className)}>
      {label && (
        <label className="tokis-label" htmlFor={id}>
          {label}
          {required && <span className="tokis-label-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className="tokis-datepicker-input-wrap">
        <button
          ref={triggerRef}
          id={id}
          type="button"
          className={cn('tokis-datepicker-trigger', open && 'tokis-datepicker-trigger--open')}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={label ? `${label}: ${parsedDate ? formatDisplayDate(parsedDate) : 'not set'}` : undefined}
          onClick={() => (open ? closePanel() : openPanel())}
        >
          <span className={cn('tokis-datepicker-value', !parsedDate && 'tokis-datepicker-placeholder')}>
            {parsedDate ? formatDisplayDate(parsedDate) : placeholder}
          </span>
          <span className="tokis-datepicker-icon" aria-hidden="true">📅</span>
        </button>
        {parsedDate && !disabled && (
          <button
            type="button"
            className="tokis-datepicker-clear"
            aria-label="Clear date"
            onClick={handleClear}
          >✕</button>
        )}
      </div>

      {open && (
        <Portal>
          <div
            ref={panelRef}
            className="tokis-datepicker-panel"
            role="dialog"
            aria-modal="false"
            aria-label={label ?? 'Date picker'}
            style={{ top: pos.top, left: pos.left }}
          >
            <Calendar value={value} onChange={handleSelect} min={min} max={max} />
          </div>
        </Portal>
      )}
    </div>
  );
}

// ─── TimePicker ──────────────────────────────────────────────────────────────

export interface TimePickerProps {
  /** Controlled value (HH:MM). */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  /** 12 or 24 hour format. @default 24 */
  hourFormat?: 12 | 24;
  /** Minute step increment. @default 1 */
  minuteStep?: number;
  className?: string;
}

export function TimePicker({
  value: valueProp,
  defaultValue,
  onChange,
  label,
  disabled = false,
  required = false,
  error = false,
  hourFormat = 24,
  minuteStep = 1,
  className,
}: TimePickerProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '00:00');
  const value = valueProp !== undefined ? valueProp : internalValue;
  const { hours, minutes } = parseTime(value);
  const id = useId('timepicker');

  const setTime = (h: number, m: number) => {
    const next = formatTime(h, m);
    if (valueProp === undefined) setInternalValue(next);
    onChange?.(next);
  };

  const hourOptions = Array.from(
    { length: hourFormat === 12 ? 12 : 24 },
    (_, i) => hourFormat === 12 ? i + 1 : i,
  );

  const minuteOptions: number[] = [];
  for (let m = 0; m < 60; m += minuteStep) minuteOptions.push(m);

  return (
    <div className={cn('tokis-timepicker', error && 'tokis-timepicker--error', disabled && 'tokis-timepicker--disabled', className)}>
      {label && (
        <label className="tokis-label" htmlFor={`${id}-hours`}>
          {label}
          {required && <span className="tokis-label-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className="tokis-timepicker-inputs">
        <select
          id={`${id}-hours`}
          className="tokis-timepicker-select"
          value={hours}
          disabled={disabled}
          aria-label="Hours"
          onChange={(e) => setTime(Number(e.target.value), minutes)}
        >
          {hourOptions.map((h) => (
            <option key={h} value={h}>{String(h).padStart(2, '0')}</option>
          ))}
        </select>

        <span className="tokis-timepicker-sep" aria-hidden="true">:</span>

        <select
          id={`${id}-minutes`}
          className="tokis-timepicker-select"
          value={minutes}
          disabled={disabled}
          aria-label="Minutes"
          onChange={(e) => setTime(hours, Number(e.target.value))}
        >
          {minuteOptions.map((m) => (
            <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
          ))}
        </select>

        {hourFormat === 12 && (
          <select
            className="tokis-timepicker-select tokis-timepicker-ampm"
            value={hours < 12 ? 'AM' : 'PM'}
            disabled={disabled}
            aria-label="AM/PM"
            onChange={(e) => {
              const ampm = e.target.value;
              let h = hours % 12;
              if (ampm === 'PM') h += 12;
              setTime(h, minutes);
            }}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        )}
      </div>
    </div>
  );
}

// ─── DateTimePicker ──────────────────────────────────────────────────────────

export interface DateTimePickerProps extends DatePickerProps {
  /** Controlled datetime value (YYYY-MM-DDTHH:MM). */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  minuteStep?: number;
  hourFormat?: 12 | 24;
}

export function DateTimePicker({
  value: valueProp,
  defaultValue,
  onChange,
  minuteStep = 1,
  hourFormat = 24,
  ...dateProps
}: DateTimePickerProps) {
  const split = (v?: string) => {
    if (!v) return { date: undefined, time: '00:00' };
    const [date, time] = v.split('T');
    return { date, time: time ?? '00:00' };
  };

  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;
  const { date, time } = split(value);

  const emit = useCallback((d?: string, t?: string) => {
    const next = d ? `${d}T${t ?? '00:00'}` : undefined;
    if (valueProp === undefined) setInternalValue(next);
    onChange?.(next);
  }, [valueProp, onChange]);

  return (
    <div className="tokis-datetimepicker">
      <DatePicker
        {...dateProps}
        value={date}
        onChange={(d) => emit(d, time)}
      />
      <TimePicker
        value={time}
        disabled={dateProps.disabled}
        minuteStep={minuteStep}
        hourFormat={hourFormat}
        onChange={(t) => emit(date, t)}
      />
    </div>
  );
}

// Re-export Calendar for standalone use
export { Calendar, type CalendarProps } from './Calendar.js';
