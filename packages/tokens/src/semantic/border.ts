import { colors } from '../primitives/colors.js';
import { semanticColors } from './color.js';

export const border = {
  default: semanticColors.onSurface,
  focus: colors.primary,
} as const;
