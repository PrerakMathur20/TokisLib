import type { SVGProps } from 'react';

/**
 * Props shared by every Tokis icon component.
 *
 * Each icon renders an `<svg>` element and forwards all standard SVG
 * attributes. `aria-hidden="true"` is set by default because icons are
 * typically decorative; pass `aria-label` to expose them to screen readers.
 */
export interface TokisIconProps extends SVGProps<SVGSVGElement> {
  /**
   * Width and height of the icon.
   * Accepts any CSS length value or a plain number (treated as pixels).
   * @default 24
   */
  size?: number | string;
  /**
   * Stroke / fill colour. Defaults to `currentColor` so the icon inherits
   * the surrounding text colour.
   * @default 'currentColor'
   */
  color?: string;
  /**
   * Stroke width for outline-style icons.
   * @default 2
   */
  strokeWidth?: number;
  /**
   * Accessible label. When provided the icon is NOT aria-hidden and a
   * visually-hidden `<title>` is added inside the SVG.
   */
  'aria-label'?: string;
}
