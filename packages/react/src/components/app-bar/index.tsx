import React from 'react';
import { cn } from '../../utils/cn.js';

export type AppBarVariant = 'default' | 'primary' | 'transparent';
export type AppBarElevation = 'none' | 'sm' | 'md';

export interface AppBarProps {
  leading?: React.ReactNode;
  title?: React.ReactNode;
  trailing?: React.ReactNode;
  variant?: AppBarVariant;
  elevation?: AppBarElevation;
  sticky?: boolean;
  className?: string;
}

export function AppBar({
  leading,
  title,
  trailing,
  variant = 'default',
  elevation = 'sm',
  sticky = false,
  className,
}: AppBarProps): JSX.Element {
  return (
    <header
      className={cn(
        'tokis-app-bar',
        variant !== 'default' && `tokis-app-bar--${variant}`,
        elevation !== 'none' && `tokis-app-bar--elevation-${elevation}`,
        sticky && 'tokis-app-bar--sticky',
        className,
      )}
    >
      {leading && <div className="tokis-app-bar__leading">{leading}</div>}
      {title && <div className="tokis-app-bar__title">{title}</div>}
      {trailing && <div className="tokis-app-bar__trailing">{trailing}</div>}
    </header>
  );
}

AppBar.displayName = 'AppBar';
