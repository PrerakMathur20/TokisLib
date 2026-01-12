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
  h1: 'synu-h1', h2: 'synu-h2', h3: 'synu-h3', h4: 'synu-h4', h5: 'synu-h5', h6: 'synu-h6',
  body1: 'synu-text', body2: 'synu-text', caption: 'synu-text', label: 'synu-text',
  code: 'synu-code', overline: 'synu-text',
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
        color && color !== 'inherit' && `synu-text--${color}`,
        truncate && 'synu-text--truncate',
        weight && `synu-text--weight-${weight}`,
        align && `synu-text--align-${align}`,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});
Typography.displayName = 'Typography';

