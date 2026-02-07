import { colors } from '../primitives/colors.js';
import { semanticColors } from '../semantic/color.js';

const darkColors = {
  ...colors,
  background: '#121212',
  surface: '#1e1e1e',
  onBackground: '#f5f5f5',
  onSurface: '#e0e0e0',
} as const;

export const darkTheme = {
  colors: darkColors,
  semanticColors: {
    ...semanticColors,
    background: darkColors.background,
    surface: darkColors.surface,
    onBackground: darkColors.onBackground,
    onSurface: darkColors.onSurface,
  },
  mode: 'dark',
} as const;
