# @tokis/react

React adapter for the Tokis design system — composable, accessible components, hooks, and theming context.

## Installation

```bash
npm install @tokis/react @tokis/theme @tokis/core @tokis/tokens
```

> Or install everything at once: `npm install @tokis/tokis`

## Usage

```tsx
import '@tokis/theme';
import { ButtonRoot, ButtonLabel, ThemeProvider } from '@tokis/react';

function App() {
  return (
    <ThemeProvider>
      <ButtonRoot variant="primary" size="lg">
        <ButtonLabel>Save changes</ButtonLabel>
      </ButtonRoot>
    </ThemeProvider>
  );
}
```

## What's Included

- **60+ components** — Button, Dialog, Drawer, Menu, Table, Charts, TreeView, and more
- **Hooks** — `useTheme`, `useControllableState`, `useDialog`, `usePopover`, `useTabs`, `useMenu`
- **ThemeProvider** — Light/dark mode with `toggle()` and `setMode()`
- **Composition** — Compound component patterns (`ButtonRoot` + `ButtonLabel` + `ButtonIcon`)
- **Full TypeScript** — Exported interfaces for every component and hook

## Peer Dependencies

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `@tokis/core` ^1.1.0
- `@tokis/tokens` ^1.1.0
- `@tokis/theme` ^1.1.0

## Documentation

Visit [tokis.dev](https://tokis.dev/docs/introduction) for interactive demos and full API reference.

## License

MIT
