import React, { forwardRef, useCallback, useRef, useState } from 'react';
import { cn } from '../../utils/cn.js';

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  label?: string;
  showValue?: boolean;
  marks?: boolean | { value: number; label?: string }[];
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(({
  value, defaultValue = 0, min = 0, max = 100, step = 1,
  onChange, disabled = false, label, showValue = false, marks, className, ...props
}, ref) => {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const trackRef = useRef<HTMLDivElement>(null);

  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step));
  const pct = ((current - min) / (max - min)) * 100;

  const handleChange = useCallback((newVal: number) => {
    const clamped = clamp(newVal);
    if (value === undefined) setInternal(clamped);
    onChange?.(clamped);
  }, [min, max, step, value, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp')   { e.preventDefault(); handleChange(current + step); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowDown') { e.preventDefault(); handleChange(current - step); }
    if (e.key === 'Home') { e.preventDefault(); handleChange(min); }
    if (e.key === 'End')  { e.preventDefault(); handleChange(max); }
    if (e.key === 'PageUp')   { e.preventDefault(); handleChange(current + step * 10); }
    if (e.key === 'PageDown') { e.preventDefault(); handleChange(current - step * 10); }
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    handleChange(min + ratio * (max - min));
  };

  type MarkItem = { value: number; label?: string };
  const markList: MarkItem[] = Array.isArray(marks)
    ? marks
    : marks
    ? [{ value: min }, { value: max }]
    : [];

  return (
    <div className={cn('tokis-slider-root', className)} data-disabled={disabled || undefined} {...props} ref={ref}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="tokis-label">{label}</span>
          {showValue && <span className="tokis-text--secondary" style={{ fontSize: 'var(--tokis-font-size-sm)' }}>{current}</span>}
        </div>
      )}
      <div className="tokis-slider-track-wrapper">
        <div ref={trackRef} className="tokis-slider-track" onClick={handleTrackClick}>
          <div className="tokis-slider-range" style={{ width: `${pct}%` }} />
        </div>
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={current}
          aria-label={label}
          aria-disabled={disabled}
          className="tokis-slider-thumb"
          style={{ left: `${pct}%` }}
          onKeyDown={handleKeyDown}
          onMouseDown={(e) => {
            if (disabled) return;
            e.preventDefault();
            const move = (me: MouseEvent) => {
              if (!trackRef.current) return;
              const rect = trackRef.current.getBoundingClientRect();
              handleChange(min + ((me.clientX - rect.left) / rect.width) * (max - min));
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', () => document.removeEventListener('mousemove', move), { once: true });
          }}
        />
      </div>
      {markList.length > 0 && (
        <div className="tokis-slider-marks">
          {markList.map((m) => (
            <span key={m.value} className="tokis-slider-mark-label">{m.label ?? m.value}</span>
          ))}
        </div>
      )}
    </div>
  );
});
Slider.displayName = 'Slider';



