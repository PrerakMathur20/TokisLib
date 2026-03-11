/**
 * Tokis primitive color tokens — canonical source of truth.
 * The CSS variable file `theme/src/base/variables.css` is generated from
 * these definitions via `scripts/generate-tokens-css.ts`.
 *
 * All values are plain strings so the object is JSON-serializable.
 */
export const colors = {
  // ── Brand: Primary ────────────────────────────────────────────────────
  primary:          '#0066ff',
  primaryHover:     '#0052cc',
  primaryActive:    '#003d99',
  primarySubtle:    '#e6f0ff',

  // ── Brand: Secondary ──────────────────────────────────────────────────
  secondary:        '#7c3aed',
  secondaryHover:   '#6d28d9',
  secondarySubtle:  '#ede9fe',

  // ── Backgrounds & Surfaces ────────────────────────────────────────────
  background:       '#ffffff',
  surface:          '#f8f9fa',
  surfaceRaised:    '#ffffff',
  surfaceOverlay:   '#ffffff',
  surfaceHover:     '#f1f5f9',
  surfaceActive:    '#e2e8f0',

  // ── Borders ───────────────────────────────────────────────────────────
  border:           '#e2e8f0',
  borderStrong:     '#cbd5e1',

  // ── Status: Error ─────────────────────────────────────────────────────
  error:            '#dc2626',
  errorSubtle:      '#fef2f2',

  // ── Status: Warning ───────────────────────────────────────────────────
  warning:          '#d97706',
  warningSubtle:    '#fffbeb',

  // ── Status: Success ───────────────────────────────────────────────────
  success:          '#16a34a',
  successSubtle:    '#f0fdf4',

  // ── Status: Info ──────────────────────────────────────────────────────
  info:             '#0284c7',
  infoSubtle:       '#f0f9ff',

  // ── Text ──────────────────────────────────────────────────────────────
  textPrimary:      '#0f172a',
  textSecondary:    '#475569',
  textTertiary:     '#94a3b8',
  textDisabled:     '#cbd5e1',
  textInverse:      '#ffffff',
  textOnPrimary:    '#ffffff',
  textLink:         '#0066ff',
  textError:        '#dc2626',
  textSuccess:      '#16a34a',
  textWarning:      '#d97706',

  // ── Neutral scale (Slate) ─────────────────────────────────────────────
  neutral50:        '#f8fafc',
  neutral100:       '#f1f5f9',
  neutral200:       '#e2e8f0',
  neutral300:       '#cbd5e1',
  neutral400:       '#94a3b8',
  neutral500:       '#64748b',
  neutral600:       '#475569',
  neutral700:       '#334155',
  neutral800:       '#1e293b',
  neutral900:       '#0f172a',

  // ── On-color ──────────────────────────────────────────────────────────
  onPrimary:        '#ffffff',
  onSecondary:      '#ffffff',
  onBackground:     '#0f172a',
  onSurface:        '#475569',
  onError:          '#ffffff',

  // ── Focus ─────────────────────────────────────────────────────────────
  focusRing:        'rgb(0 102 255 / 0.15)',
  focusRingError:   'rgb(220 38 38 / 0.15)',
} as const;
