import { useState, useCallback, useRef } from 'react';
import { isControlled } from '@synu/core';

/**
 * A React hook for managing controllable state — supporting both
 * controlled (externally managed) and uncontrolled (internally managed) modes.
 *
 * @param controlled - The externally controlled value (undefined = uncontrolled)
 * @param defaultValue - The initial value for uncontrolled mode
 * @param onChange - Optional callback invoked when internal state changes
 */
export function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): [T, (value: T | ((prev: T) => T)) => void] {
  const [internalState, setInternalState] = useState<T>(defaultValue);
  const controlled_ = isControlled(controlled);

  const value = controlled_ ? controlled : internalState;

  // Keep a stable ref to onChange to avoid stale closures
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const nextValue = typeof next === 'function'
        ? (next as (prev: T) => T)(value)
        : next;

      if (!controlled_) {
        setInternalState(nextValue);
      }
      onChangeRef.current?.(nextValue);
    },
    [controlled_, value]
  );

  return [value, setValue];
}

