import { colors } from '../primitives/colors.js';
import { semanticColors } from './color.js';

export const text = {
  primary: semanticColors.onBackground,
  secondary: semanticColors.onSurface,
  disabled: colors.neutral500,
  error: colors.error,
  onPrimary: semanticColors.onPrimary,
} as const;
