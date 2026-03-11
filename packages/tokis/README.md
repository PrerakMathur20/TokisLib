# @tokis/tokis

Performance-first, token-native UI design system for React.

This is the **meta-package** — installing `@tokis/tokis` gives you everything:

| Package | Description |
|---|---|
| `@tokis/react` | React components, hooks, and theming context |
| `@tokis/theme` | Precompiled CSS — variables, reset, component styles |
| `@tokis/core` | Headless primitives — state machines, a11y, focus management |
| `@tokis/tokens` | Design token definitions — TypeScript + JSON + CSS variables |
| `@tokis/icons` | Tree-shakable SVG icons, optional lucide-react bridge |

## Quick Start

```bash
npm install @tokis/tokis
```

```tsx
import '@tokis/theme';
import { ButtonRoot, ButtonLabel, ThemeProvider } from '@tokis/tokis';

function App() {
  return (
    <ThemeProvider>
      <ButtonRoot variant="primary">
        <ButtonLabel>Get Started</ButtonLabel>
      </ButtonRoot>
    </ThemeProvider>
  );
}
```

## Install Individual Packages

If you only need specific parts of @tokis/tokis:

```bash
# React components with all peer dependencies
npm install @tokis/react @tokis/theme @tokis/core @tokis/tokens

# Just the headless core (framework-agnostic)
npm install @tokis/core

# Just the design tokens
npm install @tokis/tokens

# Just the theme CSS
npm install @tokis/theme
```

## Features

- **Zero Runtime CSS** — No CSS-in-JS overhead. Precompiled static CSS.
- **Token-Native** — Every value is a CSS custom property. Theming is predictable.
- **Accessible by Default** — WAI-ARIA 1.2, keyboard navigation, focus management built-in.
- **Composable** — Compound component patterns. No prop explosion.
- **Dark Mode** — First-class light/dark support via `ThemeProvider`.
- **TypeScript** — Full type safety with exported interfaces for every component.
- **Tree-Shakeable** — ESM + CJS dual publish. Only ship what you use.

## Documentation

Visit [tokis.dev](https://tokis.dev) for the full documentation, interactive demos, and API reference.

## License

MIT
