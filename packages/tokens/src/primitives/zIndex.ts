/**
 * Tokis z-index tokens — layering scale.
 * These map to `--tokis-z-{key}` CSS variables.
 *
 * Layers are ordered by increasing elevation. Each layer is intentionally
 * spaced to allow insertion of custom layers without breaking the scale.
 */
export const zIndex = {
  base:     0,
  raised:   1,
  dropdown: 1000,
  sticky:   1100,
  overlay:  1200,
  modal:    1300,
  popover:  1400,
  tooltip:  1500,
  toast:    1600,
} as const;
