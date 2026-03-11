/**
 * Tokis CSS variable generator.
 *
 * Converts TypeScript primitive token objects into valid CSS custom property
 * declarations. This module serves two purposes:
 *
 *  1. **Build time** — `scripts/generate-tokens-css.ts` calls
 *     `generateAllCssVars()` and writes the output to
 *     `packages/theme/src/base/variables.css`, keeping CSS and TypeScript
 *     in perfect sync. Run with: `pnpm tokens:generate`.
 *
 *  2. **Runtime injection** (escape hatch for CSS-in-JS contexts) — call
 *     `generateAllCssVars()` and inject via a `<style>` tag. Not recommended
 *     for production; prefer the precompiled static CSS.
 *
 * Generated variable names exactly match those referenced in
 * `packages/theme/src/base/variables.css` and all component CSS files.
 *
 * Zero dependencies — plain TypeScript, no React, no DOM.
 */

import { colors }      from '../primitives/colors.js';
import { spacing }     from '../primitives/spacing.js';
import { typography }  from '../primitives/typography.js';
import { radius }      from '../primitives/radius.js';
import { shadows }     from '../primitives/shadows.js';
import { motion }      from '../primitives/motion.js';
import { zIndex }      from '../primitives/zIndex.js';
import { breakpoints } from '../primitives/breakpoints.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** camelCase → kebab-case: `primaryHover` → `primary-hover` */
function kebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** Indent every line of a multi-line string. */
function indent(str: string, spaces = 2): string {
  const pad = ' '.repeat(spaces);
  return str
    .split('\n')
    .map((l) => (l.trim() ? `${pad}${l}` : ''))
    .join('\n');
}

// ─── Light / :root block ─────────────────────────────────────────────────────

export function generateLightCssVars(): string {
  const lines: string[] = [];
  const v = (name: string, value: string | number) =>
    `--tokis-${name}: ${String(value)};`;

  // ── Primitive colors ──────────────────────────────────────────────────
  lines.push('/* Primitive Colors */');
  for (const [key, value] of Object.entries(colors)) {
    lines.push(v(`color-${kebab(key)}`, value));
  }

  // Legacy flat text-* aliases that component CSS files reference directly
  // (e.g. `--tokis-text-primary`) — kept for backward compat with theme CSS.
  lines.push('');
  lines.push('/* Text — legacy flat aliases */');
  lines.push(v('text-primary',   colors.textPrimary));
  lines.push(v('text-secondary', colors.textSecondary));
  lines.push(v('text-tertiary',  colors.textTertiary));
  lines.push(v('text-disabled',  colors.textDisabled));
  lines.push(v('text-inverse',   colors.textInverse));
  lines.push(v('text-on-primary', colors.textOnPrimary));
  lines.push(v('text-link',      colors.textLink));
  lines.push(v('text-error',     colors.textError));
  lines.push(v('text-success',   colors.textSuccess));
  lines.push(v('text-warning',   colors.textWarning));

  // ── Spacing ───────────────────────────────────────────────────────────
  lines.push('');
  lines.push('/* Spacing */');
  for (const [key, value] of Object.entries(spacing)) {
    if (!isNaN(Number(key))) {
      lines.push(v(`spacing-${key}`, value));
    }
  }

  // ── Typography ────────────────────────────────────────────────────────
  lines.push('');
  lines.push('/* Typography */');
  lines.push(v('font-family',      typography.fontFamily.sans));
  lines.push(v('font-family-mono', typography.fontFamily.mono));
  for (const [key, value] of Object.entries(typography.fontSize)) {
    lines.push(v(`font-size-${key}`, value));
  }
  for (const [key, value] of Object.entries(typography.fontWeight)) {
    if (key !== 'normal') lines.push(v(`font-weight-${key}`, value));
  }
  for (const [key, value] of Object.entries(typography.lineHeight)) {
    lines.push(v(`line-height-${key}`, value));
  }
  for (const [key, value] of Object.entries(typography.letterSpacing)) {
    lines.push(v(`letter-spacing-${kebab(key)}`, value));
  }

  // ── Border Radius ─────────────────────────────────────────────────────
  lines.push('');
  lines.push('/* Border Radius */');
  for (const [key, value] of Object.entries(radius)) {
    lines.push(v(`radius-${key}`, value));
  }

  // ── Shadows ───────────────────────────────────────────────────────────
  lines.push('');
  lines.push('/* Shadows */');
  for (const [key, value] of Object.entries(shadows)) {
    lines.push(v(`shadow-${key}`, value));
  }

  // ── Focus ─────────────────────────────────────────────────────────────
  lines.push('');
  lines.push('/* Focus */');
  lines.push(v('color-focus-ring',       colors.focusRing));
  lines.push(v('color-focus-ring-error', colors.focusRingError));

  // ── Surface interaction states ────────────────────────────────────────
  lines.push('');
  lines.push('/* Surface interaction states */');
  lines.push(v('color-surface-hover',   colors.surfaceHover));
  lines.push(v('color-surface-active',  colors.surfaceActive));

  // ── Motion ────────────────────────────────────────────────────────────
  lines.push('');
  lines.push('/* Motion */');
  for (const [key, value] of Object.entries(motion.duration)) {
    lines.push(v(`duration-${key}`, value));
  }
  for (const [key, value] of Object.entries(motion.easing)) {
    lines.push(v(`ease-${kebab(key)}`, value));
  }

  // ── Z-index ───────────────────────────────────────────────────────────
  lines.push('');
  lines.push('/* Z-index */');
  for (const [key, value] of Object.entries(zIndex)) {
    lines.push(v(`z-${key}`, value));
  }

  // ── Breakpoints ───────────────────────────────────────────────────────
  lines.push('');
  lines.push('/* Breakpoints (JS reference — not usable in @media queries) */');
  for (const [key, value] of Object.entries(breakpoints)) {
    lines.push(v(`breakpoint-${key}`, value));
  }

  return `:root {\n${indent(lines.join('\n'))}\n}`;
}

// ─── Dark theme overrides ────────────────────────────────────────────────────

/**
 * Returns only the CSS custom properties that change in dark mode.
 * Spacing, typography, radius, motion, and z-index are theme-invariant.
 */
export function generateDarkCssVars(): string {
  const dark = `\
/* Brand */
--tokis-color-primary:          #3b82f6;
--tokis-color-primary-hover:    #60a5fa;
--tokis-color-primary-active:   #93c5fd;
--tokis-color-primary-subtle:   #1e3a5f;
--tokis-color-secondary:        #a78bfa;
--tokis-color-secondary-hover:  #c4b5fd;
--tokis-color-secondary-subtle: #2e1065;

/* Backgrounds & Surfaces */
--tokis-color-background:       #0f172a;
--tokis-color-surface:          #1e293b;
--tokis-color-surface-raised:   #293548;
--tokis-color-surface-overlay:  #1e293b;
--tokis-color-surface-hover:    #334155;
--tokis-color-surface-active:   #475569;

/* Borders */
--tokis-color-border:        #334155;
--tokis-color-border-strong: #475569;

/* Status */
--tokis-color-error:           #f87171;
--tokis-color-error-subtle:    #450a0a;
--tokis-color-warning:         #fbbf24;
--tokis-color-warning-subtle:  #451a03;
--tokis-color-success:         #4ade80;
--tokis-color-success-subtle:  #052e16;
--tokis-color-info:            #38bdf8;
--tokis-color-info-subtle:     #082f49;

/* Text */
--tokis-text-primary:          #f1f5f9;
--tokis-text-secondary:        #94a3b8;
--tokis-text-tertiary:         #64748b;
--tokis-text-disabled:         #475569;
--tokis-text-inverse:          #0f172a;
--tokis-text-on-primary:       #ffffff;
--tokis-text-link:             #60a5fa;
--tokis-text-error:            #f87171;
--tokis-text-success:          #4ade80;
--tokis-text-warning:          #fbbf24;

/* Neutral scale (inverted for dark) */
--tokis-color-neutral-50:  #0f172a;
--tokis-color-neutral-100: #1e293b;
--tokis-color-neutral-200: #334155;
--tokis-color-neutral-300: #475569;
--tokis-color-neutral-400: #64748b;
--tokis-color-neutral-500: #94a3b8;
--tokis-color-neutral-600: #cbd5e1;
--tokis-color-neutral-700: #e2e8f0;
--tokis-color-neutral-800: #f1f5f9;
--tokis-color-neutral-900: #f8fafc;

/* Shadows (higher opacity for dark backgrounds) */
--tokis-shadow-xs:  0 1px 2px 0 rgb(0 0 0 / 0.30);
--tokis-shadow-sm:  0 1px 3px 0 rgb(0 0 0 / 0.40), 0 1px 2px -1px rgb(0 0 0 / 0.40);
--tokis-shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.40), 0 2px 4px -2px rgb(0 0 0 / 0.40);
--tokis-shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.40), 0 4px 6px -4px rgb(0 0 0 / 0.40);
--tokis-shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.40), 0 8px 10px -6px rgb(0 0 0 / 0.40);

/* Focus rings */
--tokis-color-focus-ring:       rgb(59 130 246 / 0.20);
--tokis-color-focus-ring-error: rgb(248 113 113 / 0.20);`;

  return `[data-theme="dark"] {\n${indent(dark)}\n}`;
}

// ─── Full stylesheet ──────────────────────────────────────────────────────────

/**
 * Returns the complete CSS variable stylesheet:
 * the light `:root` block followed by dark `[data-theme="dark"]` overrides.
 *
 * **Build-time usage** (`scripts/generate-tokens-css.ts`):
 * ```ts
 * import { generateAllCssVars } from '@tokis/tokens';
 * import { writeFileSync } from 'node:fs';
 * writeFileSync(
 *   'packages/theme/src/base/variables.css',
 *   generateAllCssVars(),
 * );
 * ```
 */
export function generateAllCssVars(): string {
  return [
    '/* ============================================================',
    '   Tokis — Design Token CSS Variables',
    '   Auto-generated by @tokis/tokens — generate-css-vars.ts',
    '   Run `pnpm tokens:generate` to regenerate after editing tokens.',
    '   ============================================================ */',
    '',
    generateLightCssVars(),
    '',
    '/* ── Dark Theme ──────────────────────────────────────────── */',
    generateDarkCssVars(),
    '',
  ].join('\n');
}

// ─── Backward-compat export ───────────────────────────────────────────────────

/**
 * @deprecated Use `generateLightCssVars()` or `generateAllCssVars()` instead.
 * The `scope` parameter is ignored; the selector is always `:root`.
 */
export function generateCssVariables(_scope = ':root'): string {
  return generateLightCssVars();
}
