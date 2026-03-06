# /core

Framework-agnostic headless primitives for the Tokis design system — state machines, accessibility helpers, and focus management. Zero dependencies.

## Installation

```bash
npm install /core
```

> Or install everything at once: `npm install tokis`

## Usage

```ts
import {
  createFocusTrap,
  rovingTabIndex,
  generateId,
  createMachine,
} from '/core';
```

## What's Included

- **Focus Management** — `createFocusTrap`, `rovingTabIndex`, `useFocusVisible`
- **Accessibility** — ARIA attribute helpers, unique ID generation
- **State Machines** — Lightweight `createMachine` for component behavior
- **Controllable State** — Unified controlled/uncontrolled state pattern

## Why Use This?

`/core` contains no React, no DOM assumptions, and no CSS. Use it to build your own component library on top of Tokis's battle-tested accessibility and state management layer — in React, Vue, Svelte, or vanilla JS.

## Documentation

Visit [tokis.dev](https://tokis.dev) for the full documentation.

## License

MIT
