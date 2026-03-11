/**
 * Calendar — standalone month-grid date picker widget.
 *
 * Implements WAI-ARIA Calendar / Date Grid pattern:
 *  - role="grid" on the day grid
 *  - role="gridcell" on each day
 *  - Arrow keys navigate within the grid
 *  - Enter/Space selects the focused date
 *  - Page Up/Down → prev/next month
 *  - Ctrl+Page Up/Down → prev/next year
 *  - Home/End → first/last day of current week
 */

import { useState, useRef, useCallback, type KeyboardEvent } from 'react';
import {
  DAYS_OF_WEEK,
  MONTHS,
  buildCalendarGrid,
  daysInMonth,
  formatDate,
  isSameDay,
  isBeforeDay,
  isAfterDay,
  today,
  parseDate,
} from './date-utils.js';
import { cn } from '../../utils/cn.js';

export interface CalendarProps {
  /** Currently selected date as YYYY-MM-DD. */
  value?: string;
  /** Fires with YYYY-MM-DD when a day is selected. */
  onChange?: (value: string) => void;
  /** Minimum selectable date (YYYY-MM-DD). */
  min?: string;
  /** Maximum selectable date (YYYY-MM-DD). */
  max?: string;
  /** Initial month to display (defaults to selected or current month). */
  defaultMonth?: { year: number; month: number };
  className?: string;
}

export function Calendar({ value, onChange, min, max, defaultMonth, className }: CalendarProps) {
  const selectedDate = parseDate(value);
  const minDate = parseDate(min);
  const maxDate = parseDate(max);
  const todayDate = today();

  const initialYear = defaultMonth?.year ?? selectedDate?.getFullYear() ?? todayDate.getFullYear();
  const initialMonth = defaultMonth?.month ?? selectedDate?.getMonth() ?? todayDate.getMonth();

  const [viewYear, setViewYear] = useState(initialYear);
  const [viewMonth, setViewMonth] = useState(initialMonth);
  const [focusedDate, setFocusedDate] = useState<Date>(selectedDate ?? todayDate);

  const gridRef = useRef<HTMLTableElement>(null);

  const grid = buildCalendarGrid(viewYear, viewMonth);

  const navigateMonth = (delta: number) => {
    setViewMonth((m) => {
      const next = m + delta;
      if (next < 0) { setViewYear((y) => y - 1); return 11; }
      if (next > 11) { setViewYear((y) => y + 1); return 0; }
      return next;
    });
  };

  const navigateYear = (delta: number) => {
    setViewYear((y) => y + delta);
  };

  const selectDate = useCallback((date: Date) => {
    if (minDate && isBeforeDay(date, minDate)) return;
    if (maxDate && isAfterDay(date, maxDate)) return;
    onChange?.(formatDate(date));
  }, [onChange, minDate, maxDate]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTableElement>) => {
    let next = new Date(focusedDate);

    switch (e.key) {
      case 'ArrowRight': next.setDate(next.getDate() + 1); break;
      case 'ArrowLeft':  next.setDate(next.getDate() - 1); break;
      case 'ArrowDown':  next.setDate(next.getDate() + 7); break;
      case 'ArrowUp':    next.setDate(next.getDate() - 7); break;
      case 'Home':       next = new Date(next.getFullYear(), next.getMonth(), 1); break;
      case 'End':        next = new Date(next.getFullYear(), next.getMonth(), daysInMonth(next.getFullYear(), next.getMonth())); break;
      case 'PageUp':
        e.ctrlKey ? navigateYear(-1) : navigateMonth(-1);
        return;
      case 'PageDown':
        e.ctrlKey ? navigateYear(1) : navigateMonth(1);
        return;
      case 'Enter':
      case ' ':
        e.preventDefault();
        selectDate(focusedDate);
        return;
      default: return;
    }

    e.preventDefault();
    setFocusedDate(next);

    // Auto-navigate view if the focused date is outside the current view month
    if (next.getFullYear() !== viewYear || next.getMonth() !== viewMonth) {
      setViewYear(next.getFullYear());
      setViewMonth(next.getMonth());
    }

    // Re-focus the cell after state update
    requestAnimationFrame(() => {
      const cell = gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]');
      cell?.focus();
    });
  };

  return (
    <div className={cn('tokis-calendar', className)} role="group" aria-label="Calendar">
      {/* Navigation header */}
      <div className="tokis-calendar-nav">
        <button
          type="button"
          className="tokis-calendar-nav-btn"
          onClick={() => navigateYear(-1)}
          aria-label="Previous year"
        >«</button>
        <button
          type="button"
          className="tokis-calendar-nav-btn"
          onClick={() => navigateMonth(-1)}
          aria-label="Previous month"
        >‹</button>

        <span className="tokis-calendar-title" aria-live="polite" aria-atomic="true">
          {MONTHS[viewMonth]} {viewYear}
        </span>

        <button
          type="button"
          className="tokis-calendar-nav-btn"
          onClick={() => navigateMonth(1)}
          aria-label="Next month"
        >›</button>
        <button
          type="button"
          className="tokis-calendar-nav-btn"
          onClick={() => navigateYear(1)}
          aria-label="Next year"
        >»</button>
      </div>

      {/* Day grid */}
      <table
        ref={gridRef}
        className="tokis-calendar-grid"
        role="grid"
        aria-label={`${MONTHS[viewMonth]} ${viewYear}`}
        onKeyDown={handleKeyDown}
      >
        <thead>
          <tr role="row">
            {DAYS_OF_WEEK.map((d) => (
              <th key={d} role="columnheader" abbr={d} className="tokis-calendar-weekday" scope="col">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((week, wi) => (
            <tr key={wi} role="row">
              {week.map((day) => {
                const isCurrentMonth = day.getMonth() === viewMonth;
                const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                const isToday = isSameDay(day, todayDate);
                const isFocused = isSameDay(day, focusedDate);
                const isDisabled = Boolean(
                  (minDate && isBeforeDay(day, minDate)) ||
                  (maxDate && isAfterDay(day, maxDate)),
                );

                return (
                  <td
                    key={day.toISOString()}
                    role="gridcell"
                    aria-selected={isSelected}
                    aria-disabled={isDisabled}
                    aria-label={day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    aria-current={isToday ? 'date' : undefined}
                    tabIndex={isFocused ? 0 : -1}
                    className={cn(
                      'tokis-calendar-day',
                      !isCurrentMonth && 'tokis-calendar-day--outside',
                      isSelected && 'tokis-calendar-day--selected',
                      isToday && 'tokis-calendar-day--today',
                      isDisabled && 'tokis-calendar-day--disabled',
                      isFocused && 'tokis-calendar-day--focused',
                    )}
                    onClick={() => !isDisabled && selectDate(day)}
                    onFocus={() => setFocusedDate(day)}
                  >
                    {day.getDate()}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Today button */}
      <div className="tokis-calendar-footer">
        <button
          type="button"
          className="tokis-calendar-today-btn"
          onClick={() => {
            setViewYear(todayDate.getFullYear());
            setViewMonth(todayDate.getMonth());
            setFocusedDate(todayDate);
            selectDate(todayDate);
          }}
        >
          Today
        </button>
      </div>
    </div>
  );
}
