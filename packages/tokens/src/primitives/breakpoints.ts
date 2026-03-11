/**
 * Tokis responsive breakpoints.
 * These map to `--tokis-breakpoint-{key}` CSS custom properties (for JS reference)
 * and should be used with `@media (min-width: ...)` in CSS files.
 *
 * Note: CSS custom properties cannot be used inside media query conditions,
 * so the values here serve as the canonical reference — CSS files hardcode
 * the same pixel values directly in `@media` rules.
 */
export const breakpoints = {
  sm:   '640px',
  md:   '768px',
  lg:   '1024px',
  xl:   '1280px',
  '2xl': '1536px',
} as const;
