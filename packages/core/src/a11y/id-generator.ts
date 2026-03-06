let globalCounter = 0;

/**
 * Generates a globally unique, incrementing ID with an optional prefix.
 * SSR Note: IDs generated server-side and client-side may differ.
 * Prefer `createIdScope` for component-level ID generation.
 */
export function generateId(prefix = 'tokis'): string {
  globalCounter += 1;
  return `${prefix}-${globalCounter}`;
}

/**
 * Creates a scoped ID generator for a component instance.
 * All IDs within a scope share the same numeric suffix,
 * making them predictably related (e.g., label-1 / input-1).
 *
 * @example
 * const scope = createIdScope('field');
 * scope('label');  // → 'field-label-1'
 * scope('input');  // → 'field-input-1'
 */
export function createIdScope(componentName: string): (part: string) => string {
  const id = generateId(componentName);
  return (part: string) => `${id}-${part}`;
}
