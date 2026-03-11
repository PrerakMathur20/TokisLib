import { useId as useReactId } from 'react';

/**
 * Returns a stable, SSR-safe, unique ID for the lifetime of the component.
 * Delegates to React 18's built-in `useId` to guarantee consistent IDs
 * across server and client renders — no hydration mismatch.
 *
 * The raw React `useId` value (e.g. `:r3:`) has colons stripped so it is safe
 * for use as an HTML `id` attribute and inside class name strings.
 *
 * @param prefix  Optional string prepended to the generated ID.
 *                Defaults to `'tokis'`.
 *
 * @example
 * const id = useId();          // → 'tokis-r3'
 * const id = useId('dialog');  // → 'dialog-r3'
 */
export function useId(prefix = 'tokis'): string {
  // React 18 useId is SSR-safe: server and client produce matching values.
  const reactId = useReactId();
  // Strip the leading/trailing colons React adds (e.g. ':r3:' → 'r3')
  const clean = reactId.replace(/:/g, '');
  return prefix ? `${prefix}-${clean}` : clean;
}
