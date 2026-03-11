/**
 * DataGrid — feature-complete data table for Tokis.
 *
 * Features:
 *  - Column sorting (asc/desc/none cycle, click header)
 *  - Quick filter toolbar
 *  - Per-column text filtering
 *  - Client-side pagination with page-size selector
 *  - Row selection (single / multi-select checkboxes)
 *  - Custom cell rendering (renderCell)
 *  - Loading skeleton state
 *  - Empty state
 *  - Windowed virtual scrolling (fixed height + rowHeight)
 *  - Controlled & uncontrolled patterns for sort, filter, page
 *  - ARIA: role="grid", aria-sort, aria-rowcount, aria-colcount
 */

import {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  type ChangeEvent,
  type MouseEvent,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { cn } from '../../utils/cn.js';
import type {
  DataGridProps,
  DataGridColumn,
  SortModel,
  FilterModel,
  RowId,
} from './types.js';
import {
  sortRows,
  filterRows,
  nextSortDirection,
  paginateRows,
} from './utils.js';

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: 'asc' | 'desc' | null }) {
  if (!direction) return <span className="tokis-dg-sort-icon tokis-dg-sort-icon--none" aria-hidden="true">⇅</span>;
  if (direction === 'asc') return <span className="tokis-dg-sort-icon" aria-hidden="true">↑</span>;
  return <span className="tokis-dg-sort-icon" aria-hidden="true">↓</span>;
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

interface ToolbarProps {
  quickFilter: string;
  onQuickFilter: (value: string) => void;
}

function DataGridToolbar({ quickFilter, onQuickFilter }: ToolbarProps) {
  return (
    <div className="tokis-dg-toolbar">
      <input
        type="search"
        className="tokis-dg-search"
        placeholder="Search…"
        value={quickFilter}
        aria-label="Quick filter"
        onChange={(e: ChangeEvent<HTMLInputElement>) => onQuickFilter(e.target.value)}
      />
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

interface HeaderProps<R extends Record<string, unknown>> {
  columns: DataGridColumn<R>[];
  sortModel: SortModel;
  onSort: (field: string) => void;
  checkboxSelection: boolean;
  allSelected: boolean;
  someSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  columnFilters: Record<string, string>;
  onColumnFilter: (field: string, value: string) => void;
}

function DataGridHeader<R extends Record<string, unknown>>({
  columns, sortModel, onSort, checkboxSelection,
  allSelected, someSelected, onSelectAll, columnFilters, onColumnFilter,
}: HeaderProps<R>) {
  return (
    <div className="tokis-dg-header" role="rowgroup">
      <div className="tokis-dg-row tokis-dg-row--header" role="row">
        {checkboxSelection && (
          <div className="tokis-dg-cell tokis-dg-cell--checkbox" role="columnheader" aria-label="Select all">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
              onChange={(e) => onSelectAll(e.target.checked)}
              aria-label="Select all rows"
            />
          </div>
        )}
        {columns.map((col) => {
          const isSorted = sortModel.field === col.field && sortModel.direction != null;
          return (
            <div
              key={col.field}
              className={cn('tokis-dg-cell', 'tokis-dg-cell--header', col.sortable !== false && 'tokis-dg-cell--sortable')}
              role="columnheader"
              aria-sort={isSorted ? (sortModel.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
              style={{ '--dg-align': col.headerAlign ?? col.align ?? 'start' } as CSSProperties}
              onClick={() => col.sortable !== false && onSort(col.field)}
            >
              {col.renderHeader ? col.renderHeader(col) : (col.headerName ?? col.field)}
              {col.sortable !== false && (
                <SortIcon direction={isSorted ? sortModel.direction : null} />
              )}
            </div>
          );
        })}
      </div>
      {/* Column filter row — only rendered if at least one column has filterable=true */}
      {columns.some((c) => c.filterable) && (
        <div className="tokis-dg-row tokis-dg-row--filter-row" role="row" aria-label="Column filters">
          {checkboxSelection && <div className="tokis-dg-cell tokis-dg-cell--checkbox" role="cell" />}
          {columns.map((col) => (
            <div key={col.field} className="tokis-dg-cell tokis-dg-cell--filter" role="cell">
              {col.filterable && (
                <input
                  type="search"
                  className="tokis-dg-col-filter"
                  placeholder={`Filter ${col.headerName ?? col.field}…`}
                  value={columnFilters[col.field] ?? ''}
                  aria-label={`Filter by ${col.headerName ?? col.field}`}
                  onChange={(e) => onColumnFilter(col.field, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  pageSize: number;
  pageSizeOptions: number[];
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

function DataGridPagination({ page, pageSize, pageSizeOptions, total, onPageChange, onPageSizeChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, total);

  return (
    <div className="tokis-dg-pagination" role="navigation" aria-label="Pagination">
      <span className="tokis-dg-pagination-info">
        {total === 0 ? '0 rows' : `${start}–${end} of ${total}`}
      </span>
      <select
        className="tokis-dg-page-size"
        value={pageSize}
        aria-label="Rows per page"
        onChange={(e) => { onPageSizeChange(Number(e.target.value)); onPageChange(0); }}
      >
        {pageSizeOptions.map((s) => <option key={s} value={s}>{s} / page</option>)}
      </select>
      <button className="tokis-dg-page-btn" disabled={page === 0} onClick={() => onPageChange(0)} aria-label="First page">«</button>
      <button className="tokis-dg-page-btn" disabled={page === 0} onClick={() => onPageChange(page - 1)} aria-label="Previous page">‹</button>
      <button className="tokis-dg-page-btn" disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)} aria-label="Next page">›</button>
      <button className="tokis-dg-page-btn" disabled={page >= totalPages - 1} onClick={() => onPageChange(totalPages - 1)} aria-label="Last page">»</button>
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function DataGridSkeleton({ rows, columns }: { rows: number; columns: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="tokis-dg-row tokis-dg-row--skeleton" role="row" aria-hidden="true">
          {Array.from({ length: columns }).map((__, c) => (
            <div key={c} className="tokis-dg-cell">
              <span className="tokis-dg-skeleton-bar" />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

// ─── Main DataGrid ────────────────────────────────────────────────────────────

export function DataGrid<R extends Record<string, unknown> = Record<string, unknown>>({
  columns,
  rows,
  rowIdField = 'id',
  loading = false,
  emptyText = 'No rows',
  checkboxSelection = false,
  selectionModel: selectionProp,
  onSelectionChange,
  onRowClick,
  sortModel: sortProp,
  onSortModelChange,
  filterModel: filterProp,
  onFilterModelChange,
  showToolbar = false,
  pageSize: pageSizeProp = 25,
  pageSizeOptions = [10, 25, 50, 100],
  page: pageProp,
  onPageChange,
  height,
  rowHeight = 48,
  className,
}: DataGridProps<R>) {
  // ── Internal state (uncontrolled fallbacks) ──
  const [sortInternal, setSortInternal] = useState<SortModel>({ field: '', direction: null });
  const [filterInternal, setFilterInternal] = useState<FilterModel>({ quickFilter: '', columnFilters: {} });
  const [pageInternal, setPageInternal] = useState(0);
  const [pageSizeInternal, setPageSizeInternal] = useState(pageSizeProp);
  const [selectionInternal, setSelectionInternal] = useState<RowId[]>([]);

  const sort = sortProp ?? sortInternal;
  const filterModel = filterProp ?? filterInternal;
  const page = pageProp ?? pageInternal;
  const pageSize = pageSizeInternal;
  const selection = selectionProp ?? selectionInternal;

  const setSort = useCallback((model: SortModel) => {
    if (onSortModelChange) onSortModelChange(model);
    else setSortInternal(model);
  }, [onSortModelChange]);

  const setFilter = useCallback((model: FilterModel) => {
    if (onFilterModelChange) onFilterModelChange(model);
    else setFilterInternal(model);
    // Reset to page 0 on filter change
    if (onPageChange) onPageChange(0);
    else setPageInternal(0);
  }, [onFilterModelChange, onPageChange]);

  const setPage = useCallback((p: number) => {
    if (onPageChange) onPageChange(p);
    else setPageInternal(p);
  }, [onPageChange]);

  const setSelection = useCallback((ids: RowId[]) => {
    if (onSelectionChange) onSelectionChange(ids);
    else setSelectionInternal(ids);
  }, [onSelectionChange]);

  // ── Process rows ──
  const processed = useMemo(() => {
    let r = filterRows(rows, filterModel, columns);
    r = sortRows(r, sort, columns);
    return r;
  }, [rows, filterModel, sort, columns]);

  const paginated = useMemo(() => paginateRows(processed, page, pageSize), [processed, page, pageSize]);

  // ── Virtualization ──
  const bodyRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const isVirtualized = typeof height === 'number';

  useEffect(() => {
    const el = bodyRef.current;
    if (!el || !isVirtualized) return;
    const handler = () => setScrollTop(el.scrollTop);
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, [isVirtualized]);

  const OVERSCAN = 5;
  const visibleStart = isVirtualized ? Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN) : 0;
  const visibleCount = isVirtualized ? Math.ceil((Number(height) / rowHeight) + OVERSCAN * 2) : paginated.length;
  const visibleEnd = Math.min(paginated.length, visibleStart + visibleCount);
  const visibleRows = isVirtualized ? paginated.slice(visibleStart, visibleEnd) : paginated;
  const paddingTop = isVirtualized ? visibleStart * rowHeight : 0;
  const paddingBottom = isVirtualized ? Math.max(0, (paginated.length - visibleEnd) * rowHeight) : 0;

  // ── Selection helpers ──
  const allOnPageSelected = paginated.length > 0 && paginated.every((r) => selection.includes(r[rowIdField] as RowId));
  const someOnPageSelected = paginated.some((r) => selection.includes(r[rowIdField] as RowId));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newIds = paginated.map((r) => r[rowIdField] as RowId);
      const merged = Array.from(new Set([...selection, ...newIds]));
      setSelection(merged);
    } else {
      const pageIds = new Set(paginated.map((r) => r[rowIdField] as RowId));
      setSelection(selection.filter((id) => !pageIds.has(id)));
    }
  };

  const handleRowSelect = (rowId: RowId, checked: boolean) => {
    if (checked) setSelection([...selection, rowId]);
    else setSelection(selection.filter((id) => id !== rowId));
  };

  // ── Sort handler ──
  const handleSort = (field: string) => {
    setSort(nextSortDirection(sort.field, sort, field));
  };

  // ── Filter handlers ──
  const handleQuickFilter = (v: string) => setFilter({ ...filterModel, quickFilter: v });
  const handleColumnFilter = (field: string, v: string) => {
    setFilter({ ...filterModel, columnFilters: { ...(filterModel.columnFilters ?? {}), [field]: v } });
  };

  // ── Render ──
  const bodyStyle: CSSProperties = height
    ? { height: typeof height === 'number' ? `${height}px` : height, overflowY: 'auto' }
    : {};

  return (
    <div
      className={cn('tokis-datagrid', className)}
      role="grid"
      aria-rowcount={processed.length}
      aria-colcount={columns.length}
      aria-busy={loading}
    >
      {showToolbar && (
        <DataGridToolbar
          quickFilter={filterModel.quickFilter ?? ''}
          onQuickFilter={handleQuickFilter}
        />
      )}

      <DataGridHeader
        columns={columns}
        sortModel={sort}
        onSort={handleSort}
        checkboxSelection={checkboxSelection}
        allSelected={allOnPageSelected}
        someSelected={someOnPageSelected}
        onSelectAll={handleSelectAll}
        columnFilters={filterModel.columnFilters ?? {}}
        onColumnFilter={handleColumnFilter}
      />

      <div className="tokis-dg-body" ref={bodyRef} style={bodyStyle} role="rowgroup">
        {loading ? (
          <DataGridSkeleton rows={Math.min(pageSize, 8)} columns={columns.length + (checkboxSelection ? 1 : 0)} />
        ) : processed.length === 0 ? (
          <div className="tokis-dg-empty" role="row"><div className="tokis-dg-cell" role="cell" style={{ gridColumn: '1 / -1' }}>{emptyText}</div></div>
        ) : (
          <>
            {paddingTop > 0 && <div style={{ height: paddingTop }} aria-hidden="true" />}
            {visibleRows.map((row, idx) => {
              const rowId = row[rowIdField] as RowId;
              const isSelected = selection.includes(rowId);
              return (
                <div
                  key={rowId ?? visibleStart + idx}
                  className={cn('tokis-dg-row', isSelected && 'tokis-dg-row--selected')}
                  role="row"
                  aria-rowindex={visibleStart + idx + 2}
                  aria-selected={checkboxSelection ? isSelected : undefined}
                  style={{ height: `${rowHeight}px` }}
                  onClick={(e) => onRowClick?.(row, e)}
                >
                  {checkboxSelection && (
                    <div className="tokis-dg-cell tokis-dg-cell--checkbox" role="gridcell">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        aria-label={`Select row ${rowId}`}
                        onChange={(e) => handleRowSelect(rowId, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                  {columns.map((col) => {
                    const value = col.valueGetter ? col.valueGetter(row) : row[col.field];
                    return (
                      <div
                        key={col.field}
                        className="tokis-dg-cell"
                        role="gridcell"
                        style={{ '--dg-align': col.align ?? 'start', ...col.cellStyle } as CSSProperties}
                      >
                        {col.renderCell ? col.renderCell({ value, row, field: col.field }) : (value as ReactNode)}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {paddingBottom > 0 && <div style={{ height: paddingBottom }} aria-hidden="true" />}
          </>
        )}
      </div>

      <DataGridPagination
        page={page}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        total={processed.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSizeInternal}
      />
    </div>
  );
}

// Re-export types so consumers can import from the same path
export type { DataGridProps, DataGridColumn, SortModel, FilterModel, RowId } from './types.js';
