import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'label' | 'code' | 'overline';
  color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning' | 'inherit';
  truncate?: boolean;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
}

const variantElementMap: Record<string, React.ElementType> = {
  h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6',
  body1: 'p', body2: 'p', caption: 'span', label: 'label', code: 'code', overline: 'span',
};

const variantClassMap: Record<string, string> = {
  h1: 'tokis-h1', h2: 'tokis-h2', h3: 'tokis-h3', h4: 'tokis-h4', h5: 'tokis-h5', h6: 'tokis-h6',
  body1: 'tokis-text', body2: 'tokis-text', caption: 'tokis-text', label: 'tokis-text',
  code: 'tokis-code', overline: 'tokis-text',
};

export const Typography = forwardRef<HTMLElement, TypographyProps>(({
  as,
  variant = 'body1',
  color,
  truncate,
  weight,
  align,
  className,
  children,
  ...props
}, ref) => {
  const Component = as ?? variantElementMap[variant] ?? 'p';
  return (
    <Component
      ref={ref}
      className={cn(
        variantClassMap[variant],
        color && color !== 'inherit' && `tokis-text--${color}`,
        truncate && 'tokis-text--truncate',
        weight && `tokis-text--weight-${weight}`,
        align && `tokis-text--align-${align}`,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});
Typography.displayName = 'Typography';

