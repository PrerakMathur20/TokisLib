# Synu

A **performance-first, token-native, zero-runtime** UI design system.

> A zero-runtime, accessible, beautifully crafted design system engineers respect.

---

## Packages

| Package | Description |
|---|---|
| `@synu/tokens` | Design token engine — primitives, semantics, themes, CSS variable generation |
| `@synu/core` | Framework-agnostic headless primitives — state machines, a11y, focus management |
| `@synu/react` | React adapter layer — composable components, hooks, context |

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
pnpm install
pnpm build
```

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

