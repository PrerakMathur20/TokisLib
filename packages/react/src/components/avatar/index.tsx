import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

// ─── Avatar ──────────────────────────────────────────────
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({ src, alt, name, size = 'md', shape = 'circle', className }, ref) => (
  <div
    ref={ref}
    className={cn('tokis-avatar', `tokis-avatar--${size}`, shape === 'square' && 'tokis-avatar--square', className)}
    aria-label={name ?? alt}
    role={name ? 'img' : undefined}
  >
    {src ? <img src={src} alt={alt ?? name ?? ''} /> : name ? getInitials(name) : null}
  </div>
));
Avatar.displayName = 'Avatar';

export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({ children, max, size = 'md', className }: AvatarGroupProps) {
  const items = React.Children.toArray(children);
  const visible = max ? items.slice(0, max) : items;
  const overflow = max && items.length > max ? items.length - max : 0;

  return (
    <div className={cn('tokis-avatar-group', className)}>
      {visible}
      {overflow > 0 && (
        <div className={cn('tokis-avatar', `tokis-avatar--${size}`)} aria-label={`${overflow} more`}>
          +{overflow}
        </div>
      )}
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({ variant = 'default', dot = false, className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn('tokis-badge', `tokis-badge--${variant}`, dot && 'tokis-badge--dot', className)}
    {...props}
  >
    {children}
  </span>
));
Badge.displayName = 'Badge';

// ─── Chip ─────────────────────────────────────────────────
export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  onDelete?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const Chip = forwardRef<HTMLDivElement, ChipProps>(({ selected = false, onDelete, disabled = false, icon, className, children, onClick, ...props }, ref) => (
  <div
    ref={ref}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick && !disabled ? 0 : undefined}
    aria-pressed={onClick ? selected : undefined}
    aria-disabled={disabled || undefined}
    className={cn('tokis-chip', onClick && 'tokis-chip--clickable', selected && 'tokis-chip--selected', className)}
    onClick={!disabled ? onClick : undefined}
    onKeyDown={onClick && !disabled ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e as unknown as React.MouseEvent<HTMLDivElement>); } } : undefined}
    {...props}
  >
    {icon && <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
    {children}
    {onDelete && (
      <span
        role="button"
        tabIndex={0}
        className="tokis-chip__delete"
        aria-label="Remove"
        onClick={(e) => { e.stopPropagation(); if (!disabled) onDelete(); }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); if (!disabled) onDelete(); } }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </span>
    )}
  </div>
));
Chip.displayName = 'Chip';

