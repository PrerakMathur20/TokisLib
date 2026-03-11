/**
 * Tokis motion tokens — durations and easing functions.
 * These map to `--tokis-duration-{key}` and `--tokis-ease-{key}` CSS variables.
 *
 * Always reference via CSS variables rather than importing at runtime to
 * preserve zero-runtime guarantee.
 */
export const motion = {
  // ── Durations ─────────────────────────────────────────────────────────
  duration: {
    fast:   '100ms',  // micro-interactions (hover, focus ring)
    normal: '200ms',  // most transitions (color, opacity)
    slow:   '300ms',  // larger state changes (dropdown, tooltip)
    slower: '500ms',  // complex animations (page-level, charts)
  },

  // ── Easing curves ─────────────────────────────────────────────────────
  easing: {
    easeIn:    'cubic-bezier(0.4, 0, 1, 1)',
    easeOut:   'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring:    'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
} as const;
