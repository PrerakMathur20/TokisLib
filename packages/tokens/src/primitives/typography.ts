/**
 * Tokis typography tokens.
 * These map to `--tokis-font-*` CSS variables.
 */
export const typography = {
  // ── Font families ─────────────────────────────────────────────────────
  fontFamily: {
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', Helvetica, Arial, sans-serif",
    mono: "'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
  },

  // ── Font sizes ────────────────────────────────────────────────────────
  fontSize: {
    xs:   '0.75rem',   // 12px
    sm:   '0.875rem',  // 14px
    md:   '1rem',      // 16px
    lg:   '1.125rem',  // 18px
    xl:   '1.25rem',   // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },

  // ── Font weights ──────────────────────────────────────────────────────
  fontWeight: {
    regular:  400,
    medium:   500,
    semibold: 600,
    bold:     700,
    /** @deprecated Use `semibold` (600) or `bold` (700) */
    normal: 400,
  },

  // ── Line heights ──────────────────────────────────────────────────────
  lineHeight: {
    tight:   1.25,
    normal:  1.5,
    relaxed: 1.75,
  },

  // ── Letter spacing ────────────────────────────────────────────────────
  letterSpacing: {
    tight:  '-0.025em',
    normal: '0em',
    wide:   '0.025em',
  },
} as const;
