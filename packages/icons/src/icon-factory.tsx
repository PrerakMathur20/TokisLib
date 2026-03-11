import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { TokisIconProps } from './types.js';

/**
 * Creates a Tokis icon component from raw SVG children.
 *
 * Usage:
 * ```tsx
 * const ChevronDownIcon = createIcon('ChevronDown', (
 *   <path d="M6 9l6 6 6-6" />
 * ));
 * ```
 *
 * All icons:
 * - render on a 24×24 viewBox
 * - use stroke="currentColor", fill="none" by default (outline style)
 * - are aria-hidden unless aria-label is provided
 * - are tree-shakable (each is a separate named export)
 */
export function createIcon(
  displayName: string,
  children: ReactNode,
  defaultStrokeWidth = 2,
) {
  const Icon = forwardRef<SVGSVGElement, TokisIconProps>(function Icon(
    {
      size = 24,
      color = 'currentColor',
      strokeWidth = defaultStrokeWidth,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
      children: _children,
      ...rest
    },
    ref,
  ) {
    const isDecorative = !ariaLabel;
    const px = typeof size === 'number' ? `${size}px` : size;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={ariaHidden ?? (isDecorative ? true : undefined)}
        aria-label={ariaLabel}
        role={ariaLabel ? 'img' : undefined}
        {...rest}
      >
        {ariaLabel && <title>{ariaLabel}</title>}
        {children}
      </svg>
    );
  });

  Icon.displayName = displayName;
  return Icon;
}
