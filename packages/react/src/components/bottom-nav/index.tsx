import React from 'react';
import { cn } from '../../utils/cn.js';

export interface BottomNavItem {
  value: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export interface BottomNavigationProps {
  items: BottomNavItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function BottomNavigation({ items, value, onChange, className }: BottomNavigationProps): JSX.Element {
  return (
    <nav className={cn('tokis-bottom-nav', className)} aria-label="Bottom navigation">
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            className={cn('tokis-bottom-nav__item', isActive && 'tokis-bottom-nav__item--active')}
            onClick={() => onChange(item.value)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.label}
          >
            <span className="tokis-bottom-nav__icon">
              {item.badge !== undefined && (
                <span className="tokis-bottom-nav__badge" aria-label={`${item.badge} notifications`}>
                  {item.badge}
                </span>
              )}
              {item.icon}
            </span>
            <span className="tokis-bottom-nav__label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

BottomNavigation.displayName = 'BottomNavigation';
