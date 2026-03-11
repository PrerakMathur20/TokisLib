/**
 * @tokis/icons
 *
 * Tree-shakable SVG icon library for Tokis.
 *
 * ```ts
 * // Import individual icons (fully tree-shakable):
 * import { ChevronDownIcon, SearchIcon } from '@tokis/icons';
 *
 * // Use Lucide React icons with the Tokis API (optional peer dep):
 * import { createTokisIcon, LucideIcon } from '@tokis/icons/lucide';
 * ```
 */

// Shared prop types
export type { TokisIconProps } from './types.js';

// Icon factory (for custom icons)
export { createIcon } from './icon-factory.js';

// All built-in icons
export * from './icons/index.js';
