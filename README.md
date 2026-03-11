# @tokis/tokis

[![GitHub](https://img.shields.io/badge/GitHub-PrerakMathur20%2FTokisLib-181717?logo=github)](https://github.com/PrerakMathur20/TokisLib)

*Tokis Only Knows Its Styles* — a performance-first, token-native, zero-runtime UI design system for React.

> Zero-runtime styling. Accessible by default. Token-native architecture.

---

## Packages

| Package | npm | Description |
|---|---|---|
| `@tokis/tokens` | [![npm](https://img.shields.io/npm/v/@tokis/tokens)](https://npmjs.com/package/@tokis/tokens) | Design token engine — primitives, semantics, themes, CSS variable generation |
| `@tokis/core` | [![npm](https://img.shields.io/npm/v/@tokis/core)](https://npmjs.com/package/@tokis/core) | Framework-agnostic headless primitives — state machines, a11y, focus management |
| `@tokis/react` | [![npm](https://img.shields.io/npm/v/@tokis/react)](https://npmjs.com/package/@tokis/react) | React components, hooks, and context providers |
| `@tokis/theme` | [![npm](https://img.shields.io/npm/v/@tokis/theme)](https://npmjs.com/package/@tokis/theme) | Pre-compiled CSS — base variables, reset, utilities, component styles |
| `@tokis/icons` | [![npm](https://img.shields.io/npm/v/@tokis/icons)](https://npmjs.com/package/@tokis/icons) | Tree-shakable SVG icons, optional lucide-react bridge |
| `@tokis/tokis` | [![npm](https://img.shields.io/npm/v/@tokis/tokis)](https://npmjs.com/package/@tokis/tokis) | Meta package — one install that re-exports everything |

---

## Installation

```bash
# Everything in one shot
npm i @tokis/tokis

# Or pick only what you need
npm i @tokis/react @tokis/theme @tokis/core @tokis/tokens
```

Then import the theme once in your entry file:

```tsx
import '@tokis/theme';
import { ThemeProvider } from '@tokis/react';

export default function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

---

## Architecture

```
@tokis/tokens ──┐
                ├──▶ @tokis/react ──▶ @tokis/tokis
@tokis/core   ──┘
@tokis/theme ──────────────────────▶ @tokis/tokis
```

- **tokens** — Pure TS/CSS. No framework dependencies.
- **core** — Pure TS. No React. No styling. State machines, ARIA, focus traps.
- **react** — Thin React adapter. Wraps core, consumes tokens via CSS variables.
- **theme** — CSS only. Ships as a single compiled stylesheet.
- **tokis** — Meta package. No logic; just re-exports the above.

---

## Core Principles

1. **Zero runtime styling** — no CSS-in-JS, no style injection at render time
2. **Token-first** — all values from CSS custom properties (`--tokis-*`)
3. **Headless core** — framework-agnostic primitives, React is just an adapter
4. **Strict TypeScript** — fully typed APIs, polymorphic component props
5. **Accessible by default** — WAI-ARIA patterns, roving tabindex, focus traps
6. **Tree-shakable** — ESM-first, side-effect free

---

## Component API Philosophy

```tsx
// Preferred — slot composition
<Button.Root>
  <Button.Icon aria-label="Add" />
  <Button.Label>Add Item</Button.Label>
</Button.Root>

// Avoided — prop explosion
<Button variant="primary" size="md" iconLeft={<AddIcon />} label="Add Item" />
```

---

## Theme Switching

Applied via a `data-theme` attribute — zero JS overhead at render time:

```css
:root               { /* light theme CSS variables */ }
[data-theme="dark"] { /* dark theme CSS variables */ }
```

```tsx
<ThemeProvider initialMode="system">
  <App />
</ThemeProvider>
```

---

## Development

```bash
# Install all workspace dependencies
npm install

# Build all packages (tokens → core → react)
npm run build

# Type-check all packages
npm run typecheck

# Clean all dist output
npm run clean
```

---

## Versioning

All packages are versioned in lockstep. The root `package.json` is the single source of truth.

```bash
# Set a new version everywhere (root + all sub-packages + cross-dep ranges)
npm run version:set 1.2.0

# Or edit root package.json manually, then sync sub-packages
npm run version:sync
```

---

## Publishing

```bash
# One-time: authenticate for the @tokis org
npm login --scope=@tokis --registry=https://registry.npmjs.org/

# Validate before publishing (typecheck + build + pack dry-run)
npm run release:check

# Publish all packages in dependency-safe order
npm run publish:all

# Or publish individually
npm run publish:tokens
npm run publish:core
npm run publish:theme
npm run publish:react
npm run publish:tokis
```

All packages have `publishConfig.access = "public"`.

---

## License

MIT © Tokis Contributors — [prerakatdev@gmail.com](mailto:prerakatdev@gmail.com)
