import { useRef } from 'react';
import { generateId } from '/core';

/**
 * Returns a stable, unique ID for the lifetime of the component.
 * Prefer React 18's built-in `useId` for SSR-safe IDs.
 * Use this hook only when a custom prefix is needed.
 */
export function useId(prefix = 'tokis'): string {
  return useRef(generateId(prefix)).current;
}
