import type { ReactNode, CSSProperties, MouseEvent } from 'react';

// ─── Column definition ────────────────────────────────────────────────────────

export interface DataGridCellParams<R = Record<string, unknown>> {
  /** The raw cell value */
  value: unknown;
  /** The full row object */
  row: R;
  /** The column field name */
  field: string;
}

export interface DataGridColumn<R = Record<string, unknown>> {
  /** Unique field key — must match a key in the row object. */
  field: string;
  /** Column header label. */
  headerName?: string;
  /** Fixed pixel width (mutually exclusive with `flex`). */
  width?: number;
  /** Flex grow ratio — distributes remaining width proportionally. */
  flex?: number;
  /** Allow sorting on this column. @default true */
  sortable?: boolean;
  /** Allow per-column text filtering. @default false */
  filterable?: boolean;
  /** Align cell content. @default 'start' */
  align?: 'start' | 'center' | 'end';
  /** Align header content. @default 'start' */
  headerAlign?: 'start' | 'center' | 'end';
  /** Inline styles for the cell. */
  cellStyle?: CSSProperties;
  /** Custom render function — overrides default value display. */
  renderCell?: (params: DataGridCellParams<R>) => ReactNode;
  /** Custom render function for the header cell. */
  renderHeader?: (col: DataGridColumn<R>) => ReactNode;
  /** Value getter — derive the sort/filter value from the row. */
  valueGetter?: (row: R) => unknown;
}

// ─── Sort state ───────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc' | null;

export interface SortModel {
  field: string;
  direction: SortDirection;
}

// ─── Filter state ─────────────────────────────────────────────────────────────

export interface FilterModel {
  /** Global quick-filter string applied across all filterable columns. */
  quickFilter?: string;
  /** Per-column filter strings. */
  columnFilters?: Record<string, string>;
}

// ─── Selection ────────────────────────────────────────────────────────────────

export type RowId = string | number;

// ─── DataGrid props ───────────────────────────────────────────────────────────

export interface DataGridProps<R extends Record<string, unknown> = Record<string, unknown>> {
  /** Column definitions. */
  columns: DataGridColumn<R>[];
  /** Array of row objects. Each row must have the fields referenced by columns. */
  rows: R[];
  /** Field used as the unique row identifier. @default 'id' */
  rowIdField?: string;
  /** Show loading skeleton over the rows area. */
  loading?: boolean;
  /** Content rendered when rows is empty (and not loading). */
  emptyText?: ReactNode;
  /** Enable checkbox column for multi-row selection. */
  checkboxSelection?: boolean;
  /** Controlled selected row ids. */
  selectionModel?: RowId[];
  /** Fires when the selection changes. */
  onSelectionChange?: (ids: RowId[]) => void;
  /** Fires when a row is clicked. */
  onRowClick?: (row: R, event: MouseEvent<HTMLElement>) => void;
  /** Controlled sort model. */
  sortModel?: SortModel;
  /** Fires when the sort model changes. */
  onSortModelChange?: (model: SortModel) => void;
  /** Controlled filter model. */
  filterModel?: FilterModel;
  /** Fires when the filter model changes. */
  onFilterModelChange?: (model: FilterModel) => void;
  /** Show the global quick-filter toolbar. */
  showToolbar?: boolean;
  /** Rows per page for pagination. @default 25 */
  pageSize?: number;
  /** Available page-size options. @default [10, 25, 50, 100] */
  pageSizeOptions?: number[];
  /** Controlled current page (0-indexed). */
  page?: number;
  /** Fires when page changes. */
  onPageChange?: (page: number) => void;
  /** Container height. If set, enables virtualized scrolling. @default 'auto' */
  height?: number | string;
  /** Fixed row height in px (required for virtualization). @default 48 */
  rowHeight?: number;
  /** Additional CSS class on the root element. */
  className?: string;
}
