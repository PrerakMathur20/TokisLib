import type { DataGridColumn, FilterModel, SortModel } from './types.js';

/** Extract a comparable value from a row cell. */
export function getCellValue<R extends Record<string, unknown>>(
  row: R,
  col: DataGridColumn<R>,
): unknown {
  return col.valueGetter ? col.valueGetter(row) : row[col.field];
}

/** Sort rows by a single column. Returns a new array. */
export function sortRows<R extends Record<string, unknown>>(
  rows: R[],
  sortModel: SortModel,
  columns: DataGridColumn<R>[],
): R[] {
  if (!sortModel.direction) return rows;

  const col = columns.find((c) => c.field === sortModel.field);
  if (!col) return rows;

  return [...rows].sort((a, b) => {
    const av = getCellValue(a, col);
    const bv = getCellValue(b, col);

    let cmp = 0;
    if (typeof av === 'number' && typeof bv === 'number') {
      cmp = av - bv;
    } else {
      cmp = String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true, sensitivity: 'base' });
    }

    return sortModel.direction === 'asc' ? cmp : -cmp;
  });
}

/** Filter rows based on the FilterModel. Returns a new array. */
export function filterRows<R extends Record<string, unknown>>(
  rows: R[],
  filterModel: FilterModel,
  columns: DataGridColumn<R>[],
): R[] {
  let result = rows;

  // Global quick filter
  const q = filterModel.quickFilter?.trim().toLowerCase();
  if (q) {
    const filterableCols = columns.filter((c) => c.filterable !== false);
    result = result.filter((row) =>
      filterableCols.some((col) => {
        const v = getCellValue(row, col);
        return String(v ?? '').toLowerCase().includes(q);
      }),
    );
  }

  // Per-column filters
  const colFilters = filterModel.columnFilters ?? {};
  const activeColFilters = Object.entries(colFilters).filter(([, v]) => v.trim() !== '');
  if (activeColFilters.length > 0) {
    result = result.filter((row) =>
      activeColFilters.every(([field, filterStr]) => {
        const col = columns.find((c) => c.field === field);
        if (!col) return true;
        const v = getCellValue(row, col);
        return String(v ?? '').toLowerCase().includes(filterStr.toLowerCase());
      }),
    );
  }

  return result;
}

/** Cycle sort direction: null → asc → desc → null */
export function nextSortDirection(
  currentField: string,
  currentModel: SortModel,
  clickedField: string,
): SortModel {
  if (currentModel.field !== clickedField || currentModel.direction === null) {
    return { field: clickedField, direction: 'asc' };
  }
  if (currentModel.direction === 'asc') {
    return { field: clickedField, direction: 'desc' };
  }
  return { field: clickedField, direction: null };
}

/** Paginate an array. Returns the slice for the given page. */
export function paginateRows<T>(rows: T[], page: number, pageSize: number): T[] {
  const start = page * pageSize;
  return rows.slice(start, start + pageSize);
}

/** Compute column widths from fixed + flex definitions. */
export function computeColumnWidths<R>(
  columns: DataGridColumn<R>[],
  totalWidth: number,
): number[] {
  const fixed = columns.map((c) => c.width ?? 0);
  const totalFixed = fixed.reduce((s, w) => s + w, 0);
  const totalFlex = columns.reduce((s, c) => s + (c.flex ?? 0), 0);
  const remaining = Math.max(0, totalWidth - totalFixed);

  return columns.map((col, i) => {
    if (col.width) return col.width;
    if (totalFlex > 0 && col.flex) return (col.flex / totalFlex) * remaining;
    return fixed[i] || 120; // fallback
  });
}
