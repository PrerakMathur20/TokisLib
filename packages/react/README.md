# /react

React adapter for the Tokis design system — composable, accessible components, hooks, and theming context.

## Installation

```bash
npm install /react /theme
```

> Or install everything at once: `npm install tokis`

## Usage

```tsx
import '/theme';
import { ButtonRoot, ButtonLabel, ThemeProvider } from '/react';

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
- `/theme` ^0.1.0

## Documentation

Visit [tokis.dev](https://tokis.dev/docs/introduction) for interactive demos and full API reference.

## License

MIT
