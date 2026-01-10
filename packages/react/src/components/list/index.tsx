import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

// ─── List ────────────────────────────────────────────────
export const List = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, role = 'list', ...props }, ref) => (
    <div ref={ref} role={role} className={cn('synu-list', className)} {...props} />
  )
);
List.displayName = 'List';

export interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  endContent?: React.ReactNode;
  primary?: React.ReactNode;
  secondary?: React.ReactNode;
  clickable?: boolean;
}

export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(({
  selected = false, disabled = false, icon, endContent, primary, secondary, clickable = false,
  className, children, onClick, ...props
}, ref) => (
  <div
    ref={ref}
    role={clickable ? 'listitem' : 'listitem'}
    tabIndex={clickable && !disabled ? 0 : undefined}
    aria-selected={selected || undefined}
    aria-disabled={disabled || undefined}
    className={cn('synu-list-item', (clickable || onClick) && 'synu-list-item--clickable', selected && 'synu-list-item--selected', className)}
    onClick={!disabled ? onClick : undefined}
    onKeyDown={!disabled && onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e as unknown as React.MouseEvent<HTMLDivElement>); } } : undefined}
    {...props}
  >
    {icon && <span className="synu-list-item__icon" aria-hidden="true">{icon}</span>}
    {(primary || secondary) ? (
      <div className="synu-list-item__content">
        {primary && <div className="synu-list-item__primary">{primary}</div>}
        {secondary && <div className="synu-list-item__secondary">{secondary}</div>}
      </div>
    ) : children}
    {endContent && <span className="synu-list-item__end">{endContent}</span>}
  </div>
));
ListItem.displayName = 'ListItem';

