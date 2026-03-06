import React, { forwardRef, CSSProperties } from 'react';
import { cn } from '../../utils/cn.js';

type GapValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

const gapVar = (g: GapValue) => `var(--tokis-spacing-${g})`;

// ─── Stack ────────────────────────────────────────────────
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  gap?: GapValue;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: boolean;
  as?: React.ElementType;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(({
  direction = 'column', gap = 4, align, justify, wrap = false, as: Component = 'div', className, style, children, ...props
}, ref) => (
  <Component
    ref={ref}
    className={cn('tokis-stack', direction === 'column' ? 'tokis-stack--v' : 'tokis-stack--h', wrap && 'tokis-stack--wrap', className)}
    style={{ gap: gapVar(gap), alignItems: align, justifyContent: justify, ...style }}
    {...props}
  >
    {children}
  </Component>
));
Stack.displayName = 'Stack';

// ─── Grid ─────────────────────────────────────────────────
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | string;
  gap?: GapValue;
  rowGap?: GapValue;
  columnGap?: GapValue;
  as?: React.ElementType;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(({
  columns = 1, gap = 4, rowGap, columnGap, as: Component = 'div', className, style, children, ...props
}, ref) => (
  <Component
    ref={ref}
    className={cn('tokis-grid', className)}
    style={{
      gridTemplateColumns: (typeof columns === 'number') ? `repeat(${columns}, minmax(0, 1fr))` : (columns as string),
      gap: gapVar(gap),
      rowGap: rowGap !== undefined ? gapVar(rowGap) : undefined,
      columnGap: columnGap !== undefined ? gapVar(columnGap) : undefined,
      ...style,
    }}
    {...props}
  >
    {children}
  </Component>
));
Grid.displayName = 'Grid';

// ─── Container ────────────────────────────────────────────
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  fluid?: boolean;
  as?: React.ElementType;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(({ fluid = false, as: Component = 'div', className, ...props }, ref) => (
  <Component ref={ref} className={cn('tokis-container', fluid && 'tokis-container--fluid', className)} {...props} />
));
Container.displayName = 'Container';

// ─── Box ──────────────────────────────────────────────────
export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  display?: CSSProperties['display'];
  flex?: CSSProperties['flex'];
  gap?: GapValue;
  p?: GapValue;
  px?: GapValue;
  py?: GapValue;
  m?: GapValue;
  width?: string;
  height?: string;
}

export const Box = forwardRef<HTMLElement, BoxProps>(({
  as: Component = 'div', display, flex, gap, p, px, py, m, width, height, className, style, ...props
}, ref) => (
  <Component
    ref={ref}
    className={cn('tokis-box', className)}
    style={{
      display,
      flex,
      gap: gap !== undefined ? gapVar(gap) : undefined,
      padding: p !== undefined ? gapVar(p) : undefined,
      paddingLeft: px !== undefined ? gapVar(px) : undefined,
      paddingRight: px !== undefined ? gapVar(px) : undefined,
      paddingTop: py !== undefined ? gapVar(py) : undefined,
      paddingBottom: py !== undefined ? gapVar(py) : undefined,
      margin: m !== undefined ? gapVar(m) : undefined,
      width,
      height,
      ...style,
    }}
    {...props}
  />
));
Box.displayName = 'Box';


