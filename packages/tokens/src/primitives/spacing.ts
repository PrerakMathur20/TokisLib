/**
 * Tokis spacing tokens.
 * Uses a 4px base unit with numeric keys that map directly to
 * `--tokis-spacing-{key}` CSS variables (e.g. `spacing[4]` → `--tokis-spacing-4`).
 *
 * Named aliases (xs/sm/md/lg/xl) are preserved for backward compatibility
 * but numeric keys are the preferred form in component code.
 */
export const spacing = {
  // ── Numeric scale (4 px base) ─────────────────────────────────────────
  0:  '0px',
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '20px',
  6:  '24px',
  8:  '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',

  // ── Named aliases (legacy / semantic) ────────────────────────────────
  /** @deprecated Use numeric key `1` → 4px */
  xs: '4px',
  /** @deprecated Use numeric key `2` → 8px */
  sm: '8px',
  /** @deprecated Use numeric key `4` → 16px */
  md: '16px',
  /** @deprecated Use numeric key `6` → 24px */
  lg: '24px',
  /** @deprecated Use numeric key `8` → 32px */
  xl: '32px',
} as const;
