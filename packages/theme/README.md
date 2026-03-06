# /theme

Default visual theme for the Tokis design system — CSS variables, component styles, reset, and typography. Zero-runtime, precompiled CSS.

## Installation

```bash
npm install /theme
```

> Or install everything at once: `npm install tokis`

## Usage

Import the full theme (recommended):

```tsx
import '/theme';
```

Or import individual layers:

```tsx
import '/theme/base';           // Variables + reset
import '/theme/components';     // All component styles
import '/theme/utilities';      // Utility classes
```

Or import specific component styles:

```tsx
import '/theme/base';
import '/theme/components/button';
import '/theme/components/dialog';
```

## What's Included

- **CSS Variables** — Full token set: colors, spacing, radius, shadows, typography, motion, z-index
- **Reset** — Minimal, opinionated CSS reset
- **Component Styles** — Styles for every `/react` component
- **Dark Mode** — Automatic via `[data-theme="dark"]` attribute
- **Utilities** — Common helper classes

## Documentation

Visit [tokis.dev](https://tokis.dev/docs/theming) for the theming guide.

## License

MIT
