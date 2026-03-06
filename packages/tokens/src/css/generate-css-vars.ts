import { colors } from '../primitives/colors.js';
import { spacing } from '../primitives/spacing.js';
import { radius } from '../primitives/radius.js';
import { typography } from '../primitives/typography.js';
import { shadows } from '../primitives/shadows.js';
import { motion } from '../primitives/motion.js';
import { zIndex } from '../primitives/zIndex.js';
import { breakpoints } from '../primitives/breakpoints.js';
import { semanticColors } from '../semantic/color.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';
import { border } from '../semantic/border.js';

export function generateCssVariables(scope = ':root'): string {
  const vars: string[] = [];
  const prefix = '--tokis-';

  const add = (name: string, value: string | number) => {
    vars.push(`  ${prefix}${name}: ${String(value)};`);
  };

  // Primitive: Colors
  Object.entries(colors).forEach(([key, value]) => add(`color-${key}`, value));

  // Primitive: Spacing
  Object.entries(spacing).forEach(([key, value]) => add(`spacing-${key}`, value));

  // Primitive: Radius
  Object.entries(radius).forEach(([key, value]) => add(`radius-${key}`, value));

  // Primitive: Typography
  Object.entries(typography.fontSize).forEach(([key, value]) => add(`font-size-${key}`, value));
  Object.entries(typography.fontWeight).forEach(([key, value]) => add(`font-weight-${key}`, String(value)));
  add('font-family', typography.fontFamily);

  // Primitive: Shadows
  Object.entries(shadows).forEach(([key, value]) => add(`shadow-${key}`, value));

  // Primitive: Motion
  Object.entries(motion.duration).forEach(([key, value]) => add(`motion-duration-${key}`, value));
  Object.entries(motion.easing).forEach(([key, value]) => add(`motion-easing-${key}`, value));

  // Primitive: Z-Index
  Object.entries(zIndex).forEach(([key, value]) => add(`z-index-${key}`, String(value)));

  // Primitive: Breakpoints
  Object.entries(breakpoints).forEach(([key, value]) => add(`breakpoint-${key}`, value));

  // Semantic: Colors
  Object.entries(semanticColors).forEach(([key, value]) => add(`semantic-color-${key}`, value));

  // Semantic: Surface
  Object.entries(surface).forEach(([key, value]) => add(`surface-${key}`, value));

  // Semantic: Text
  Object.entries(text).forEach(([key, value]) => add(`text-${key}`, value));

  // Semantic: Border
  Object.entries(border).forEach(([key, value]) => add(`border-${key}`, value));

  return `${scope} {\n${vars.join('\n')}\n}`;
}
