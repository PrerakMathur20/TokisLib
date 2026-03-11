/**
 * Zero-dependency date utilities for the DatePicker calendar.
 * All functions operate on plain JS Date objects or ISO YYYY-MM-DD strings.
 */

export const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

/** Parse a YYYY-MM-DD string → local Date (midnight). Returns null if invalid. */
export function parseDate(iso: string | undefined): Date | null {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const [, y, mo, d] = m.map(Number);
  const date = new Date(y, mo - 1, d);
  // Guard against e.g. "2024-02-30" auto-rolling to March
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
  return date;
}

/** Format a Date → YYYY-MM-DD string. */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Format a Date for the input display label (e.g., "Jan 15, 2025"). */
export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Return the first day of the month for a given year/month (0-indexed). */
export function startOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}

/** Return the number of days in a month. */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Build the 6×7 calendar grid for a given year/month. Returns Date[][] (some days in prev/next month). */
export function buildCalendarGrid(year: number, month: number): Date[][] {
  const firstDay = startOfMonth(year, month).getDay(); // 0=Sun
  const totalDays = daysInMonth(year, month);

  const cells: Date[] = [];

  // Pad with days from previous month
  const prevMonthDays = daysInMonth(year, month - 1 < 0 ? 11 : month - 1);
  const prevYear = month === 0 ? year - 1 : year;
  const prevMonth = month === 0 ? 11 : month - 1;
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push(new Date(prevYear, prevMonth, prevMonthDays - i));
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    cells.push(new Date(year, month, d));
  }

  // Pad to complete 6 rows (42 cells)
  const nextYear = month === 11 ? year + 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  let nextDay = 1;
  while (cells.length < 42) {
    cells.push(new Date(nextYear, nextMonth, nextDay++));
  }

  // Split into 6 rows of 7
  const rows: Date[][] = [];
  for (let r = 0; r < 6; r++) {
    rows.push(cells.slice(r * 7, r * 7 + 7));
  }
  return rows;
}

/** Returns true if two dates represent the same calendar day. */
export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

/** Returns true if a date is before the given min date (by day). */
export function isBeforeDay(date: Date, min: Date): boolean {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const m = new Date(min.getFullYear(), min.getMonth(), min.getDate());
  return d < m;
}

/** Returns true if a date is after the given max date (by day). */
export function isAfterDay(date: Date, max: Date): boolean {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const m = new Date(max.getFullYear(), max.getMonth(), max.getDate());
  return d > m;
}

/** Returns today as a local midnight Date. */
export function today(): Date {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

/** Parse a HH:MM string into { hours, minutes }. */
export function parseTime(t: string | undefined): { hours: number; minutes: number } {
  if (!t) return { hours: 0, minutes: 0 };
  const [h, m] = t.split(':').map(Number);
  return { hours: h ?? 0, minutes: m ?? 0 };
}

/** Format { hours, minutes } → HH:MM string. */
export function formatTime(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
