import { describe, it, expect } from 'vitest';
import {
  sortRows,
  filterRows,
  nextSortDirection,
  paginateRows,
  computeColumnWidths,
} from '../components/datagrid/utils.js';
import type { DataGridColumn, FilterModel, SortModel } from '../components/datagrid/types.js';

// ─── Fixtures ──────────────────────────────────────────────────────────────

interface Person {
  id: number;
  name: string;
  age: number;
  city: string;
}

const people: Person[] = [
  { id: 1, name: 'Alice',   age: 30, city: 'New York'    },
  { id: 2, name: 'Charlie', age: 25, city: 'Los Angeles' },
  { id: 3, name: 'Bob',     age: 35, city: 'Chicago'     },
  { id: 4, name: 'Diana',   age: 28, city: 'New York'    },
];

const columns: DataGridColumn<Person>[] = [
  { field: 'name',    header: 'Name',    sortable: true, filterable: true },
  { field: 'age',     header: 'Age',     sortable: true, filterable: true },
  { field: 'city',    header: 'City',    sortable: true, filterable: true },
];

// ─── sortRows ─────────────────────────────────────────────────────────────

describe('sortRows', () => {
  it('returns the original array when direction is null', () => {
    const model: SortModel = { field: 'name', direction: null };
    const sorted = sortRows(people, model, columns);
    expect(sorted.map((p) => p.id)).toEqual([1, 2, 3, 4]);
  });

  it('sorts strings ascending (A → Z)', () => {
    const model: SortModel = { field: 'name', direction: 'asc' };
    const sorted = sortRows(people, model, columns);
    expect(sorted.map((p) => p.name)).toEqual(['Alice', 'Bob', 'Charlie', 'Diana']);
  });

  it('sorts strings descending (Z → A)', () => {
    const model: SortModel = { field: 'name', direction: 'desc' };
    const sorted = sortRows(people, model, columns);
    expect(sorted.map((p) => p.name)).toEqual(['Diana', 'Charlie', 'Bob', 'Alice']);
  });

  it('sorts numbers ascending', () => {
    const model: SortModel = { field: 'age', direction: 'asc' };
    const sorted = sortRows(people, model, columns);
    expect(sorted.map((p) => p.age)).toEqual([25, 28, 30, 35]);
  });

  it('sorts numbers descending', () => {
    const model: SortModel = { field: 'age', direction: 'desc' };
    const sorted = sortRows(people, model, columns);
    expect(sorted.map((p) => p.age)).toEqual([35, 30, 28, 25]);
  });

  it('does not mutate the original array', () => {
    const original = [...people];
    const model: SortModel = { field: 'name', direction: 'asc' };
    sortRows(people, model, columns);
    expect(people).toEqual(original);
  });

  it('returns original rows when field does not match any column', () => {
    const model: SortModel = { field: 'nonexistent', direction: 'asc' };
    const sorted = sortRows(people, model, columns);
    expect(sorted).toEqual(people);
  });

  it('uses valueGetter when provided on a column', () => {
    const colsWithGetter: DataGridColumn<Person>[] = [
      ...columns,
      {
        field: 'nameLen',
        header: 'Name Length',
        sortable: true,
        valueGetter: (row) => row.name.length,
      },
    ];
    const model: SortModel = { field: 'nameLen', direction: 'asc' };
    const sorted = sortRows(people, model, colsWithGetter);
    // Alice=5, Bob=3, Charlie=7, Diana=5 → Bob(3), Alice(5)|Diana(5), Charlie(7)
    expect(sorted[0].name).toBe('Bob');
    expect(sorted[sorted.length - 1].name).toBe('Charlie');
  });
});

// ─── filterRows ───────────────────────────────────────────────────────────

describe('filterRows', () => {
  it('returns all rows when filterModel is empty', () => {
    const model: FilterModel = {};
    expect(filterRows(people, model, columns)).toHaveLength(4);
  });

  it('filters by quickFilter (case-insensitive, any filterable column)', () => {
    const model: FilterModel = { quickFilter: 'alice' };
    const result = filterRows(people, model, columns);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice');
  });

  it('quickFilter matches across multiple columns', () => {
    const model: FilterModel = { quickFilter: 'new york' };
    const result = filterRows(people, model, columns);
    expect(result.map((p) => p.name)).toEqual(['Alice', 'Diana']);
  });

  it('returns empty array when quickFilter matches nothing', () => {
    const model: FilterModel = { quickFilter: 'zzz-no-match' };
    expect(filterRows(people, model, columns)).toHaveLength(0);
  });

  it('filters by columnFilters on a specific field', () => {
    const model: FilterModel = { columnFilters: { city: 'new york' } };
    const result = filterRows(people, model, columns);
    expect(result.map((p) => p.name)).toEqual(['Alice', 'Diana']);
  });

  it('combines quickFilter AND columnFilters (both must match)', () => {
    const model: FilterModel = {
      quickFilter: 'new york',
      columnFilters: { name: 'alice' },
    };
    const result = filterRows(people, model, columns);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice');
  });

  it('ignores empty columnFilter values', () => {
    const model: FilterModel = { columnFilters: { name: '' } };
    expect(filterRows(people, model, columns)).toHaveLength(4);
  });

  it('does not filter on columns with filterable=false', () => {
    const noFilterCols: DataGridColumn<Person>[] = [
      { field: 'name', header: 'Name', filterable: false },
      { field: 'age',  header: 'Age',  filterable: true  },
    ];
    // Filtering for "alice" should NOT match since name is not filterable
    const model: FilterModel = { quickFilter: 'alice' };
    const result = filterRows(people, model, noFilterCols);
    expect(result).toHaveLength(0);
  });
});

// ─── nextSortDirection ────────────────────────────────────────────────────

describe('nextSortDirection', () => {
  it('first click on a column → asc', () => {
    const current: SortModel = { field: '', direction: null };
    const next = nextSortDirection('', current, 'name');
    expect(next).toEqual({ field: 'name', direction: 'asc' });
  });

  it('second click on same column → desc', () => {
    const current: SortModel = { field: 'name', direction: 'asc' };
    const next = nextSortDirection('name', current, 'name');
    expect(next).toEqual({ field: 'name', direction: 'desc' });
  });

  it('third click on same column → null (clear sort)', () => {
    const current: SortModel = { field: 'name', direction: 'desc' };
    const next = nextSortDirection('name', current, 'name');
    expect(next).toEqual({ field: 'name', direction: null });
  });

  it('clicking a different column resets to asc', () => {
    const current: SortModel = { field: 'name', direction: 'desc' };
    const next = nextSortDirection('name', current, 'age');
    expect(next).toEqual({ field: 'age', direction: 'asc' });
  });
});

// ─── paginateRows ─────────────────────────────────────────────────────────

describe('paginateRows', () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it('returns first page', () => {
    expect(paginateRows(data, 0, 3)).toEqual([1, 2, 3]);
  });

  it('returns second page', () => {
    expect(paginateRows(data, 1, 3)).toEqual([4, 5, 6]);
  });

  it('returns partial last page', () => {
    expect(paginateRows(data, 3, 3)).toEqual([10]);
  });

  it('returns empty array for out-of-range page', () => {
    expect(paginateRows(data, 99, 3)).toEqual([]);
  });
});

// ─── computeColumnWidths ──────────────────────────────────────────────────

describe('computeColumnWidths', () => {
  it('uses fixed widths for columns with explicit width', () => {
    const cols: DataGridColumn<Person>[] = [
      { field: 'name', header: 'Name', width: 200 },
      { field: 'age',  header: 'Age',  width: 100 },
    ];
    const widths = computeColumnWidths(cols, 500);
    expect(widths[0]).toBe(200);
    expect(widths[1]).toBe(100);
  });

  it('distributes remaining space proportionally via flex', () => {
    const cols: DataGridColumn<Person>[] = [
      { field: 'name', header: 'Name', width: 100 },
      { field: 'city', header: 'City', flex: 1 },
      { field: 'age',  header: 'Age',  flex: 2 },
    ];
    // totalWidth=400, fixed=100, remaining=300, totalFlex=3
    // city = (1/3)*300 = 100, age = (2/3)*300 = 200
    const widths = computeColumnWidths(cols, 400);
    expect(widths[0]).toBe(100);
    expect(widths[1]).toBe(100);
    expect(widths[2]).toBe(200);
  });

  it('falls back to 120px when no width or flex is specified', () => {
    const cols: DataGridColumn<Person>[] = [
      { field: 'name', header: 'Name' },
    ];
    const widths = computeColumnWidths(cols, 500);
    expect(widths[0]).toBe(120);
  });
});
