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
    <nav ref={ref} aria-label="Breadcrumb" className={cn('tokis-breadcrumbs', className)} {...props}>
      <ol style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', listStyle: 'none', margin: 0, padding: 0 }}>
        {visible.map((item, i) => {
          const isLast = i === visible.length - 1;
          const isCurrent = item.current || isLast;
          return (
            <li key={i} className={cn('tokis-breadcrumbs-item', isCurrent && 'tokis-breadcrumbs-item--current')} aria-current={isCurrent ? 'page' : undefined}>
              {item.href ? (
                <a href={item.href} className="tokis-breadcrumbs-link">{item.label}</a>
              ) : item.onClick ? (
                <button className="tokis-breadcrumbs-link" onClick={item.onClick} style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}>{item.label}</button>
              ) : (
                <span>{item.label}</span>
              )}
              {!isLast && <span className="tokis-breadcrumbs-separator" aria-hidden="true">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
Breadcrumbs.displayName = 'Breadcrumbs';

// Pagination moved to components/pagination/index.tsx

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
    className={cn('tokis-link', external && 'tokis-link--external', className)}
    {...props}
  >
    {children}
  </a>
));
Link.displayName = 'Link';


