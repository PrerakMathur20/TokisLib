import { useRef } from 'react';
import { generateId } from '@synu/core';

/**
 * Returns a stable, unique ID for the lifetime of the component.
 * Prefer React 18's built-in `useId` for SSR-safe IDs.
 * Use this hook only when a custom prefix is needed.
 */
export function useId(prefix = 'synu'): string {
  return useRef(generateId(prefix)).current;
}
