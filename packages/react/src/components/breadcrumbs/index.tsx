import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

// ─── Breadcrumbs ─────────────────────────────────────────
export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
  current?: boolean;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(({
  items, separator = '/', maxItems, className, ...props
}, ref) => {
  const visible = maxItems && items.length > maxItems
    ? [items[0], { label: '…', onClick: undefined }, ...items.slice(-(maxItems - 1))]
    : items;

  return (
    <nav ref={ref} aria-label="Breadcrumb" className={cn('synu-breadcrumbs', className)} {...props}>
      <ol style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', listStyle: 'none', margin: 0, padding: 0 }}>
        {visible.map((item, i) => {
          const isLast = i === visible.length - 1;
          const isCurrent = item.current || isLast;
          return (
            <li key={i} className={cn('synu-breadcrumbs-item', isCurrent && 'synu-breadcrumbs-item--current')} aria-current={isCurrent ? 'page' : undefined}>
              {item.href ? (
                <a href={item.href} className="synu-breadcrumbs-link">{item.label}</a>
              ) : item.onClick ? (
                <button className="synu-breadcrumbs-link" onClick={item.onClick} style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}>{item.label}</button>
              ) : (
                <span>{item.label}</span>
              )}
              {!isLast && <span className="synu-breadcrumbs-separator" aria-hidden="true">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
Breadcrumbs.displayName = 'Breadcrumbs';

// ─── Pagination ───────────────────────────────────────────
export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  page: number;
  count: number;
  onChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  disabled?: boolean;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(({
  page, count, onChange, siblingCount = 1, showFirstLast = true, disabled = false, className, ...props
}, ref) => {
  const pages: (number | '…')[] = [];
  const delta = siblingCount;
  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

  if (count <= 7) {
    pages.push(...range(1, count));
  } else {
    const left = Math.max(2, page - delta);
    const right = Math.min(count - 1, page + delta);
    pages.push(1);
    if (left > 2) pages.push('…');
    pages.push(...range(left, right));
    if (right < count - 1) pages.push('…');
    pages.push(count);
  }

  return (
    <nav ref={ref} aria-label="Pagination" className={cn('synu-pagination', className)} {...props}>
      {showFirstLast && (
        <button
          className={cn('synu-pagination-item', (page === 1 || disabled) && 'synu-pagination-item--disabled')}
          aria-label="First page"
          disabled={page === 1 || disabled}
          onClick={() => onChange(1)}
        >‹‹</button>
      )}
      <button
        className={cn('synu-pagination-item', (page === 1 || disabled) && 'synu-pagination-item--disabled')}
        aria-label="Previous page"
        disabled={page === 1 || disabled}
        onClick={() => onChange(page - 1)}
      >‹</button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="synu-pagination-ellipsis" aria-hidden="true">…</span>
        ) : (
          <button
            key={p}
            className={cn('synu-pagination-item', p === page && 'synu-pagination-item--active', disabled && 'synu-pagination-item--disabled')}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            disabled={disabled}
            onClick={() => typeof p === 'number' && onChange(p)}
          >{p}</button>
        )
      )}
      <button
        className={cn('synu-pagination-item', (page === count || disabled) && 'synu-pagination-item--disabled')}
        aria-label="Next page"
        disabled={page === count || disabled}
        onClick={() => onChange(page + 1)}
      >›</button>
      {showFirstLast && (
        <button
          className={cn('synu-pagination-item', (page === count || disabled) && 'synu-pagination-item--disabled')}
          aria-label="Last page"
          disabled={page === count || disabled}
          onClick={() => onChange(count)}
        >››</button>
      )}
    </nav>
  );
});
Pagination.displayName = 'Pagination';

// ─── Link ─────────────────────────────────────────────────
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
  underline?: 'always' | 'hover' | 'none';
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ external = false, underline = 'hover', className, children, ...props }, ref) => (
  <a
    ref={ref}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    className={cn('synu-link', external && 'synu-link--external', className)}
    {...props}
  >
    {children}
  </a>
));
Link.displayName = 'Link';


