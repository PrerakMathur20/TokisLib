# /tokens

Design token engine for the Tokis design system — color primitives, semantic scales, spacing, typography, shadows, motion, and CSS variable generation.

## Installation

```bash
npm install /tokens
```

> Or install everything at once: `npm install tokis`

## Usage

### TypeScript / JavaScript

```ts
import {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  motion,
  lightTheme,
  darkTheme,
  generateCSSVars,
} from '/tokens';

// Generate CSS custom properties from a theme
const css = generateCSSVars(lightTheme);
```

### CSS

```css
@import '/tokens/css';
```

## What's Included

- **Primitive Tokens** — Colors, spacing, radius, typography, shadows, motion, z-index, breakpoints
- **Semantic Tokens** — Color roles, surface levels, text hierarchy, border styles
- **Themes** — Light and dark theme definitions
- **CSS Generation** — `generateCSSVars()` to produce CSS custom properties from any theme object
- **Full TypeScript** — Every token is fully typed

## Documentation

Visit [tokis.dev](https://tokis.dev/docs/theming) for the theming and token guide.

## License

MIT
