# Tokis

A **performance-first, token-native, zero-runtime** UI design system.

> A zero-runtime, accessible, beautifully crafted design system engineers respect.

---

## Packages

| Package | Description |
|---|---|
| `/tokens` | Design token engine — primitives, semantics, themes, CSS variable generation |
| `/core` | Framework-agnostic headless primitives — state machines, a11y, focus management |
| `/react` | React adapter layer — composable components, hooks, context |
| `/theme` | Default CSS theme package — base variables, reset, utilities, and component styles |

---

## Architecture

```
tokens → react
core   → react
```

- **tokens**: Pure TS/CSS. No framework dependencies.
- **core**: Pure TS. No React. No styling.
- **react**: Thin adapter. Wraps core. Consumes tokens via CSS variables.

---

## Getting Started

```bash
npm install
npm run build
```

## Publish To npm Org

From the repo root:

```bash
# one-time auth for scoped org packages
npm login --scope=@tokis --registry=https://registry.npmjs.org/

# optional full validation (typecheck + build + pack dry-run)
npm run release:check

# publish in dependency-safe order
npm run publish:all
```

Notes:
- All workspace packages are configured with `publishConfig.access=public`.
- `/tokens` now ships `dist/css/index.css` for the `/tokens/css` export.

---

## Core Principles

1. Zero runtime styling (no CSS-in-JS)
2. Token-first via CSS variables
3. Headless core, framework-agnostic
4. Strict TypeScript
5. Full accessibility (WAI-ARIA)
6. Tree-shakable ESM exports

---

## Component API Philosophy

```tsx
// Preferred — composition
<Button.Root>
  <Button.Icon aria-label="Add" />
  <Button.Label>Add Item</Button.Label>
</Button.Root>

// Avoided — prop explosion
<Button variant="primary" size="md" iconLeft={<AddIcon />} />
```

---

## Theme Switching

Themes are applied via `data-theme` attribute — zero JS overhead at render time:

```css
:root { /* light theme CSS variables */ }
[data-theme="dark"] { /* dark theme CSS variables */ }
```

```tsx
<ThemeProvider initialMode="light">
  <App />
</ThemeProvider>
```
