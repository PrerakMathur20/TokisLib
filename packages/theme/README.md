# @tokis/theme

Default visual theme for the Tokis design system — CSS variables, component styles, reset, and typography. Zero-runtime, precompiled CSS.

## Installation

```bash
npm install @tokis/theme
```

> Or install everything at once: `npm install @tokis/tokis`

## Usage

Import the full theme (recommended):

```tsx
import '@tokis/theme';
```

Or import individual layers:

```tsx
import '@tokis/theme/base';           // Variables + reset
import '@tokis/theme/components';     // All component styles
import '@tokis/theme/utilities';      // Utility classes
```

Or import specific component styles:

```tsx
import '@tokis/theme/base';
import '@tokis/theme/components/button';
import '@tokis/theme/components/dialog';
```

## What's Included

- **CSS Variables** — Full token set: colors, spacing, radius, shadows, typography, motion, z-index
- **Reset** — Minimal, opinionated CSS reset
- **Component Styles** — Styles for every `@tokis/react` component
- **Dark Mode** — Automatic via `[data-theme="dark"]` attribute
- **Utilities** — Common helper classes

## Documentation

Visit [tokis.dev](https://tokis.dev/docs/theming) for the theming guide.

## License

MIT
