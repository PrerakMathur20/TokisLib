import { describe, it, expect } from 'vitest';
import {
  parseDate,
  formatDate,
  buildCalendarGrid,
  isSameDay,
  isBeforeDay,
  isAfterDay,
  daysInMonth,
  parseTime,
  formatTime,
  today,
} from '../components/datepicker/date-utils.js';

// ─── parseDate ─────────────────────────────────────────────────────────────

describe('parseDate', () => {
  it('parses a valid YYYY-MM-DD string into a local Date', () => {
    const d = parseDate('2025-06-15');
    expect(d).not.toBeNull();
    expect(d!.getFullYear()).toBe(2025);
    expect(d!.getMonth()).toBe(5);   // 0-indexed
    expect(d!.getDate()).toBe(15);
  });

  it('returns null for undefined input', () => {
    expect(parseDate(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(parseDate('')).toBeNull();
  });

  it('returns null for invalid format', () => {
    expect(parseDate('15-06-2025')).toBeNull();
    expect(parseDate('2025/06/15')).toBeNull();
  });

  it('returns null for invalid dates that would roll over (e.g. Feb 30)', () => {
    expect(parseDate('2024-02-30')).toBeNull();
  });

  it('handles leap year Feb 29 correctly', () => {
    const d = parseDate('2024-02-29');
    expect(d).not.toBeNull();
    expect(d!.getDate()).toBe(29);
  });

  it('returns null for non-leap year Feb 29', () => {
    expect(parseDate('2023-02-29')).toBeNull();
  });
});

// ─── formatDate ───────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(formatDate(new Date(2025, 0, 5))).toBe('2025-01-05');
    expect(formatDate(new Date(2025, 11, 31))).toBe('2025-12-31');
  });

  it('pads single-digit months and days with a leading zero', () => {
    expect(formatDate(new Date(2025, 0, 1))).toBe('2025-01-01');
    expect(formatDate(new Date(2025, 8, 9))).toBe('2025-09-09');
  });

  it('round-trips with parseDate', () => {
    const original = '2025-03-17';
    const d = parseDate(original)!;
    expect(formatDate(d)).toBe(original);
  });
});

// ─── daysInMonth ──────────────────────────────────────────────────────────

describe('daysInMonth', () => {
  it('returns 31 for January', () => {
    expect(daysInMonth(2025, 0)).toBe(31);
  });

  it('returns 28 for February in a non-leap year', () => {
    expect(daysInMonth(2023, 1)).toBe(28);
  });

  it('returns 29 for February in a leap year', () => {
    expect(daysInMonth(2024, 1)).toBe(29);
  });

  it('returns 30 for April', () => {
    expect(daysInMonth(2025, 3)).toBe(30);
  });

  it('returns 31 for December', () => {
    expect(daysInMonth(2025, 11)).toBe(31);
  });
});

// ─── buildCalendarGrid ────────────────────────────────────────────────────

describe('buildCalendarGrid', () => {
  it('always produces exactly 6 rows', () => {
    const grid = buildCalendarGrid(2025, 0); // Jan 2025
    expect(grid).toHaveLength(6);
  });

  it('each row has exactly 7 cells', () => {
    const grid = buildCalendarGrid(2025, 0);
    grid.forEach((row) => expect(row).toHaveLength(7));
  });

  it('includes all days of the target month', () => {
    const grid = buildCalendarGrid(2025, 0); // 31 days
    const dates = grid.flat();
    const jan2025Days = dates.filter(
      (d) => d.getFullYear() === 2025 && d.getMonth() === 0,
    );
    expect(jan2025Days).toHaveLength(31);
  });

  it('pads with previous-month days so the grid starts on Sunday', () => {
    // Jan 1, 2025 is a Wednesday (day 3) — so first 3 cells should be Dec days
    const grid = buildCalendarGrid(2025, 0);
    const firstRow = grid[0];
    const prevMonthCells = firstRow.filter((d) => d.getMonth() === 11); // December
    expect(prevMonthCells.length).toBe(3); // Wed=3, so 3 Dec days prepend
  });

  it('pads with next-month days to complete 42 cells', () => {
    const grid = buildCalendarGrid(2025, 0);
    const dates = grid.flat();
    const jan = dates.filter((d) => d.getMonth() === 0 && d.getFullYear() === 2025);
    const dec = dates.filter((d) => d.getMonth() === 11 && d.getFullYear() === 2024);
    const feb = dates.filter((d) => d.getMonth() === 1 && d.getFullYear() === 2025);
    expect(jan.length + dec.length + feb.length).toBe(42);
  });
});

// ─── isSameDay ────────────────────────────────────────────────────────────

describe('isSameDay', () => {
  it('returns true for the same calendar day', () => {
    const a = new Date(2025, 5, 15, 8, 0);  // 8am
    const b = new Date(2025, 5, 15, 23, 59); // 11pm
    expect(isSameDay(a, b)).toBe(true);
  });

  it('returns false for different days', () => {
    expect(isSameDay(new Date(2025, 5, 15), new Date(2025, 5, 16))).toBe(false);
  });

  it('returns false for same day but different month', () => {
    expect(isSameDay(new Date(2025, 4, 15), new Date(2025, 5, 15))).toBe(false);
  });
});

// ─── isBeforeDay / isAfterDay ─────────────────────────────────────────────

describe('isBeforeDay', () => {
  it('returns true when date is before min', () => {
    expect(isBeforeDay(new Date(2025, 0, 1), new Date(2025, 0, 5))).toBe(true);
  });

  it('returns false when date equals min', () => {
    expect(isBeforeDay(new Date(2025, 0, 5), new Date(2025, 0, 5))).toBe(false);
  });

  it('returns false when date is after min', () => {
    expect(isBeforeDay(new Date(2025, 0, 10), new Date(2025, 0, 5))).toBe(false);
  });
});

describe('isAfterDay', () => {
  it('returns true when date is after max', () => {
    expect(isAfterDay(new Date(2025, 0, 10), new Date(2025, 0, 5))).toBe(true);
  });

  it('returns false when date equals max', () => {
    expect(isAfterDay(new Date(2025, 0, 5), new Date(2025, 0, 5))).toBe(false);
  });

  it('returns false when date is before max', () => {
    expect(isAfterDay(new Date(2025, 0, 1), new Date(2025, 0, 5))).toBe(false);
  });
});

// ─── today ────────────────────────────────────────────────────────────────

describe('today', () => {
  it('returns a Date with hours/minutes/seconds set to 0 (local midnight)', () => {
    const t = today();
    expect(t.getHours()).toBe(0);
    expect(t.getMinutes()).toBe(0);
    expect(t.getSeconds()).toBe(0);
    expect(t.getMilliseconds()).toBe(0);
  });

  it('matches the current local date', () => {
    const now = new Date();
    const t = today();
    expect(t.getFullYear()).toBe(now.getFullYear());
    expect(t.getMonth()).toBe(now.getMonth());
    expect(t.getDate()).toBe(now.getDate());
  });
});

// ─── parseTime / formatTime ───────────────────────────────────────────────

describe('parseTime', () => {
  it('parses HH:MM into hours and minutes', () => {
    expect(parseTime('09:30')).toEqual({ hours: 9, minutes: 30 });
    expect(parseTime('23:59')).toEqual({ hours: 23, minutes: 59 });
    expect(parseTime('00:00')).toEqual({ hours: 0, minutes: 0 });
  });

  it('returns zero hours and minutes for undefined', () => {
    expect(parseTime(undefined)).toEqual({ hours: 0, minutes: 0 });
  });

  it('returns zero hours and minutes for empty string', () => {
    expect(parseTime('')).toEqual({ hours: 0, minutes: 0 });
  });
});

describe('formatTime', () => {
  it('formats as HH:MM with leading zeros', () => {
    expect(formatTime(9, 5)).toBe('09:05');
    expect(formatTime(0, 0)).toBe('00:00');
    expect(formatTime(23, 59)).toBe('23:59');
  });

  it('round-trips with parseTime', () => {
    const original = '14:07';
    const { hours, minutes } = parseTime(original);
    expect(formatTime(hours, minutes)).toBe(original);
  });
});
