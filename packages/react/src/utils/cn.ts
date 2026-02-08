/**
 * Utility: compose multiple class names, filtering falsy values.
 * Keeps the bundle size near-zero — no external dependency needed.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

