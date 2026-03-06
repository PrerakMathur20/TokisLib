import React from 'react';
import { cn } from '../../utils/cn.js';

export interface NavRailItem {
  value: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export interface NavigationRailProps {
  items: NavRailItem[];
  value: string;
  onChange: (value: string) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function NavigationRail({ items, value, onChange, header, footer, className }: NavigationRailProps): JSX.Element {
  return (
    <nav className={cn('tokis-nav-rail', className)} aria-label="Navigation rail">
      {header && <div className="tokis-nav-rail__header">{header}</div>}
      <div className="tokis-nav-rail__items">
        {items.map((item) => {
          const isActive = item.value === value;
          return (
            <button
              key={item.value}
              className={cn('tokis-nav-rail__item', isActive && 'tokis-nav-rail__item--active')}
              onClick={() => onChange(item.value)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
            >
              <span className="tokis-nav-rail__icon">
                {item.badge !== undefined && (
                  <span className="tokis-nav-rail__badge" aria-label={`${item.badge} notifications`}>
                    {item.badge}
                  </span>
                )}
                {item.icon}
              </span>
              <span className="tokis-nav-rail__label">{item.label}</span>
            </button>
          );
        })}
      </div>
      {footer && <div className="tokis-nav-rail__footer">{footer}</div>}
    </nav>
  );
}

NavigationRail.displayName = 'NavigationRail';
