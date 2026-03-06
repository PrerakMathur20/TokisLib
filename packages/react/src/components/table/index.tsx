import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

// ─── Table ─────────────────────────────────────────────────
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  container?: boolean;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(({ striped = false, container = true, className, children, ...props }, ref) => {
  const table = (
    <table
      ref={ref}
      className={cn('tokis-table', striped && 'tokis-table--striped', !container && className)}
      {...props}
    >
      {children}
    </table>
  );
  if (!container) return table;
  return <div className={cn('tokis-table-container', className)}>{table}</div>;
});
Table.displayName = 'Table';

export const TableHead = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  (props, ref) => <thead ref={ref} {...props} />
);
TableHead.displayName = 'TableHead';

export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  (props, ref) => <tbody ref={ref} {...props} />
);
TableBody.displayName = 'TableBody';

export const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  (props, ref) => <tr ref={ref} {...props} />
);
TableRow.displayName = 'TableRow';

export interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | false;
  onSort?: () => void;
}

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  ({ sortable, sorted, onSort, className, children, ...props }, ref) => (
    <th
      ref={ref}
      scope="col"
      aria-sort={sorted ? sorted === 'asc' ? 'ascending' : 'descending' : sortable ? 'none' : undefined}
      className={cn(sortable && 'tokis-table th--sortable', className)}
      onClick={sortable ? onSort : undefined}
      onKeyDown={sortable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSort?.(); } } : undefined}
      tabIndex={sortable ? 0 : undefined}
      {...props}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        {children}
        {sortable && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ opacity: sorted ? 1 : 0.4 }}>
            {sorted !== 'asc' && <path d="M4 7l2 2 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>}
            {sorted !== 'desc' && <path d="M4 5l2-2 2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>}
          </svg>
        )}
      </span>
    </th>
  )
);
TableHeaderCell.displayName = 'TableHeaderCell';

export const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  (props, ref) => <td ref={ref} {...props} />
);
TableCell.displayName = 'TableCell';

