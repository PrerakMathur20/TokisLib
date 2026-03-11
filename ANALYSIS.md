# TokisLib — Comprehensive Library Analysis

> **Verdict up front:** TokisLib is an architecturally impressive, zero-runtime design system with genuine technical merits — but it is not yet ready to replace a mature library like Material UI or Chakra UI for production use. The architecture is worth building on; the library is worth finishing. Read on for the full breakdown.

---

## 1. What Is TokisLib?

**TOKIS** — "Tokis Only Knows Its Styles" — is a performance-first, token-native, zero-runtime UI design system for React. It is a monorepo composed of five packages:

| Package | Role | Version |
|---|---|---|
| `@tokis/tokens` | TypeScript design tokens + CSS variable definitions | 1.1.0 |
| `@tokis/core` | Framework-agnostic headless primitives, a11y, state machines | 1.1.0 |
| `@tokis/theme` | Pure precompiled CSS stylesheet (light + dark themes) | 1.1.0 |
| `@tokis/react` | React adapter layer (50+ components, hooks, context) | 1.1.0 |
| `@tokis/tokis` | Umbrella package re-exporting all of the above | 1.1.0 |

---

## 2. Architecture Deep Dive

### 2.1 Layering (Strict & Enforced)

```
tokens → theme → react
core → react
utils → core → react
```

This is more than aspirational — it is structurally enforced. `@tokis/core` imports no React. `@tokis/theme` is pure CSS. `@tokis/tokens` is plain TypeScript objects exported as `const`. This means:

- The core logic is genuinely framework-agnostic and could power a Vue or Svelte adapter tomorrow
- Tree shaking is viable because there are no runtime side effects
- SSR is safe because there is no style injection at runtime

### 2.2 Token System

The token system has two tiers:

**Primitive tokens** (raw values):
```typescript
colors, spacing (xs/sm/md/lg/xl), radius (5 levels),
typography (font family, sizes xs–xl, weights 400/500/700),
shadows (sm/md/lg), motion (durations + 1 easing),
zIndex (dropdown/modal/tooltip), breakpoints (sm/md/lg/xl)
```

**Semantic tokens** (intent-driven):
```typescript
semanticColors → primary, secondary, background, surface, error, onX
text          → primary, secondary, disabled, error, onPrimary
border        → default (onSurface), focus (primary)
surface       → default, elevated
```

**CSS variable layer** (`variables.css`) is the source of truth for the browser. It defines a comprehensive, production-grade token set:
- 10-step neutral scale (`--tokis-color-neutral-50` → `900`)
- 8 spacing steps up to `--tokis-spacing-24: 96px`
- 8 font sizes up to `--tokis-font-size-4xl`
- 7 shadow levels
- 7 z-index layers
- 4 motion easings
- Full dark theme via `[data-theme="dark"]`

⚠️ **Critical Gap**: The TypeScript primitive files (e.g., `spacing.ts` only has 5 values: xs/sm/md/lg/xl) are **not synchronized** with the CSS variable file (which has 13 spacing steps). Token consumers using the TypeScript API see an incomplete picture compared to what CSS actually provides. These two layers must be kept in manual sync — no code generation bridges them.

### 2.3 Headless Core

`@tokis/core` provides:
- **`createMachine()`** — A lightweight state machine factory (0 dependencies, not XState). Clean generics: `createMachine<State, Event, Context>`.
- **`trapFocus()`** — Full focus trap with Tab/Shift+Tab cycling. Returns a cleanup function.
- **`rovingTabIndex()`** — Arrow key navigation for composite widgets. Supports Home/End.
- **`useFocusVisible()`** — CSS `:focus-visible` equivalent as an imperative DOM utility.
- **`isControlled()` / `resolveInitialState()`** — Framework-agnostic controlled/uncontrolled state helpers.
- **`generateId()` / `createIdScope()`** — Incrementing ID factory with scoped variant.
- **ARIA helpers** — Both imperative setters (`setAriaExpanded`) and prop-object factories (`ariaExpandedProps`). Deprecated aliases maintained.

Only `Button` has a state machine in `core`. All other complex components implement their own React state directly — the headless core is not yet fully populated as planned.

### 2.4 Component Architecture (React Layer)

Components follow strict patterns:

**Composition API** (not prop explosion):
```tsx
<Button.Root variant="primary" size="md">
  <Button.Icon aria-label="Add" />
  <Button.Label>Add Item</Button.Label>
</Button.Root>
```

**Polymorphic `as` prop** on Button, Typography, Layout primitives (Stack, Grid, Container, Box).

**`forwardRef` throughout** — All stateful components expose their DOM ref.

**Controlled + Uncontrolled** — Accordion, Tabs, Dialog, Popover all support both patterns via `useControllableState`.

**`useId()` from React 18** — Used natively in most components for SSR-safe unique IDs. The library's own `useId` hook from `@tokis/core` is a fallback for prefix-customization only.

---

## 3. Component Inventory

### 3.1 Implemented Components (50+)

| Category | Components |
|---|---|
| **Form Inputs** | TextField, Textarea, Checkbox, Radio, Switch, Select, Slider, SearchField, Toggle, NumberField, OtpInput, FileDropZone, Autocomplete |
| **Buttons & Actions** | ButtonRoot, ButtonIcon, ButtonLabel, ButtonGroup, FloatingActionButton, SpeedDial |
| **Layout** | Stack, Grid, Container, Box |
| **Typography** | Typography (12 variants: h1–h6, body1/2, caption, label, code, overline) |
| **Surfaces** | Card, CardHeader, CardBody, CardFooter, Paper, Divider |
| **Navigation** | Breadcrumbs, Link, Pagination, Stepper, AppBar, BottomNav, NavRail, Tabs |
| **Data Display** | Table (with sortable headers), Avatar, AvatarGroup, Badge, Chip/Tag, List, TreeView, Timeline, Statistic, DataGrid (basic) |
| **Overlays** | Dialog, Drawer, Tooltip, Popover, Menu, ContextMenu, HoverCard, Dropdown, CommandPalette, ConfirmDialog, Modal |
| **Feedback** | Alert, Snackbar/Toast (with `useSnackbar` hook), Progress, CircularProgress, Spinner, Skeleton |
| **Data & Performance** | VirtualizedList (window virtualization), InfiniteScroll |
| **Charts** | BarChart (vertical + horizontal), LineChart (smooth + animated), PieChart/Donut, Sparkline (line/bar/area) |
| **Utility / Extended** | Accordion, CodeBlock, EmptyState, Result, Rating/StarRating, TransferList, Fade, Popper, Backdrop, NoSsr, CssBaseline, InitColorSchemeScript, useMediaQuery |
| **Date/Time** | DatePicker, TimePicker, DateTimePicker (native input wrappers) |
| **Portals** | Portal (SSR-safe `createPortal` wrapper) |

### 3.2 Hooks

| Hook | Purpose |
|---|---|
| `useDialog` | Dialog open/close state + full ARIA prop objects for trigger + dialog |
| `usePopover` | Popover open/close with anchor ref + ARIA |
| `useMenu` | Menu open/close with keyboard navigation + `getMenuProps` / `getItemProps` |
| `useTabs` | Tab selection with keyboard navigation + `getTabProps` / `getPanelProps` |
| `useSnackbar` | Toast queue management (add, dismiss, dismissAll) |
| `useControllableState` | Controlled/uncontrolled state bridge |
| `useTheme` | Access theme mode + toggle + setMode |
| `useMediaQuery` | Reactive media query hook |

### 3.3 Quality Assessment Per Component

**Well-implemented (production quality):**
- `ButtonRoot` — polymorphic, loading state, proper `aria-busy`, state machine integrated
- `Dialog` — focus trap from core, scroll lock, Escape key, portal, full ARIA
- `CommandPalette` — search, grouping, keyboard nav, shortcuts display, focus trap, portal
- `Tabs` — WAI-ARIA compliant (tablist/tab/tabpanel), horizontal/vertical, disabled, keyboard nav
- `Accordion` — single/multiple expand, collapsible, WAI-ARIA compliant, CSS grid animation
- `Tooltip` — portal-based position calculation, delay, 4 placements, focus + hover
- `TextField` — SSR-safe IDs, password toggle with icons, aria-invalid, helper text
- `VirtualizedList` — proper windowing implementation with overscan
- `Charts` (BarChart, LineChart, PieChart, Sparkline) — SVG-based, animated, responsive, hover tooltips
- `Snackbar` — auto-dismiss, actions, aria-live polite, 5 positions, `useSnackbar` hook

**Minimal/stub implementations:**
- `DataGrid` — Just wraps `<Table>`. No sorting, filtering, pagination, virtualization, selection, or column resizing.
- `DatePicker/TimePicker/DateTimePicker` — Native HTML `<input type="date">` wrappers with a label. No calendar UI.
- `Icon` — Uses Unicode emoji characters (`⌕ × ☰ ✓ ★ →`) — not production grade, not scalable.
- `MaterialIcon` — Renders a string as a `<span>`. Requires manually loading a Material Icons web font.
- `Charts (extended/index.tsx)` — Duplicate minimal bar chart exists in `extended/index.tsx`; the proper implementations are in `charts/index.tsx`.

---

## 4. Accessibility Analysis

### What's Done Right

- **Focus trap** implemented in core (`trapFocus`) and used correctly in Dialog and CommandPalette
- **Roving tabindex** implemented in core (`rovingTabIndex`) for composite widget navigation
- **Focus visible** tracking via `useFocusVisible` (matches CSS `:focus-visible` spec)
- **ARIA roles/attributes** consistently applied:
  - Dialog: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`
  - Menu: `role="menu"`, `role="menuitem"`, `aria-orientation`
  - Tabs: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`
  - Accordion: `aria-expanded`, `aria-controls`, `role="region"`
  - Chip: `role="button"`, `aria-pressed`, `aria-disabled` with keyboard Enter/Space
  - Table: `scope="col"`, `aria-sort` on sortable headers
  - Snackbar: `aria-live="polite"`, `aria-atomic="false"`
  - CommandPalette: `role="listbox"`, `role="option"`, `aria-selected`
- **Keyboard navigation** in Menu (Arrow/Home/End/Escape), Tabs (Arrow/Home/End), Accordion, Slider
- **Scroll lock** on Dialog open (body overflow hidden)
- **Return focus** after Dialog close (previous active element restored)
- **Reduced motion** respected via CSS `@media (prefers-reduced-motion: reduce)` in reset.css
- **Screen reader labels** on icon-only buttons, close buttons, delete chips
- **`aria-busy`** on loading buttons
- **Password toggle** has proper `aria-label` (Show/Hide password)

### Accessibility Gaps

- **No automated accessibility tests** (no axe-core integration, no Cypress accessibility checks)
- **`useId()` from core** (custom hook) is not SSR-safe (increments a global counter); most components correctly use React 18's built-in `useId` but the custom hook is still exported
- **RTL support** is declared as a requirement in AGENTS.md but not implemented in CSS
- **High contrast mode** — declared as a requirement but not tested/implemented
- **Screen reader validation** — declared as a testing strategy but not verifiable without test suite
- **Modal** in `extended/index.tsx` is a thin wrapper that lacks focus trap, scroll lock, and proper ARIA
- **Accordion** uses `aria-hidden` + `data-open` for animation via CSS grid but this approach hides content from AT even when partially visible during transition

---

## 5. Performance Analysis

### What's Correct

- **Zero runtime CSS** — No emotion, no styled-components, no CSS-in-JS. Styles are precompiled.
- **CSS variables for theming** — Theme switches via `document.documentElement.setAttribute('data-theme', mode)`. Zero JS involved in style recalculation.
- **Tree-shakable** — `"sideEffects": false` in all package.json files. Named exports only.
- **ESM + CJS** — Both module formats supported via `exports` map.
- **React Server Component safe** — No browser-only APIs in rendering path (Portal checks `typeof document === 'undefined'`).
- **`useCallback` / `useMemo`** correctly used in performance-critical hooks (useMenu, CommandPalette filtering/grouping).
- **VirtualizedList** — Proper window virtualization, no external dependency.
- **ResizeObserver** used in charts for responsive sizing.
- **SSR hydration** — `InitColorSchemeScript` is provided to set theme before first paint (eliminates flash of wrong theme).

### Performance Gaps

- **Single barrel export** — `packages/react/src/index.ts` exports 100+ items from one file. While tree-shaking works at the bundler level, the TypeScript compilation creates one `index.d.ts` for all types, which can slow down IDE performance in large projects.
- **Charts are SVG-based, custom** — No canvas fallback, no progressive rendering for large datasets.
- **No bundle size tracking** — ProjectPlan.md mentions tracking "bundle size per component" but no tooling (bundlesize, size-limit) is configured.
- **Inline styles in layout components** — `Stack`, `Grid`, and `Box` use inline `style={{}}` props for gap/padding (computed from CSS variables). This defeats style caching; each render re-creates the style object.

---

## 6. Developer Experience

### Good

- **Single install**: `npm install tokis` gets everything
- **Clean API**: Most components are self-explanatory
- **Typed props**: Full TypeScript with strict inference
- **Composition API**: `<Button.Root>` pattern prevents prop drilling
- **Hooks-first overlay API**: `useDialog`, `usePopover`, `useMenu`, `useTabs` — these are genuinely useful for building custom overlays
- **`cn()` utility**: Zero-dependency classname joiner exported from `@tokis/react`
- **`useControllableState`**: Properly handles controlled/uncontrolled without surprise
- **`InitColorSchemeScript`**: Excellent DX for dark mode without flash

### Poor

- **No documentation site** — No Storybook, no VitePress, no interactive playground. The README files in packages are minimal stubs.
- **No tests** — Zero test files exist in the entire repository. No unit, integration, or visual regression tests.
- **No examples** — No usage examples, no getting started guide beyond the basic README.
- **Playground missing** — `apps/playground/` mentioned in FileAndFolderStructure.md does not exist.
- **CSS not automatically generated from tokens** — `generate-css-vars.ts` is referenced in `tokens/src/index.ts` but the `css/` subfolder does not exist. The CSS variable file and TS tokens are maintained independently.
- **Icon system is placeholder** — Unicode emoji is used for icons. A real icon library (Lucide, Heroicons, Phosphor) integration is absent.

---

## 7. Comparison: TokisLib vs Material UI vs Chakra UI

### Feature Matrix

| Feature | TokisLib (v1.0.1) | Material UI (v6) | Chakra UI (v3) |
|---|:---:|:---:|:---:|
| Zero runtime CSS | ✅ | ✅ (Pigment CSS in v6) | ✅ (Panda CSS in v3) |
| Token-first theming | ✅ | ✅ | ✅ |
| Light / dark mode | ✅ | ✅ | ✅ |
| TypeScript support | ✅ | ✅ | ✅ |
| Component count | ~50+ | 100+ | 90+ |
| Built-in charts | ✅ (4 chart types) | ❌ (separate MUI X) | ❌ |
| Built-in virtualization | ✅ | ✅ (MUI X) | ❌ |
| Command palette | ✅ | ❌ | ❌ |
| DatePicker (calendar UI) | ❌ (native input only) | ✅ (MUI X Date Pickers) | ✅ |
| DataGrid (real) | ❌ (table wrapper only) | ✅ (MUI X DataGrid) | ❌ |
| Test coverage | ❌ (zero tests) | ✅ (thousands of tests) | ✅ |
| Documentation site | ❌ | ✅ | ✅ |
| Storybook / playground | ❌ | ✅ | ✅ |
| Community size | 1 contributor | 3000+ contributors | 1000+ contributors |
| A11y audit | ❌ (not done) | ✅ | ✅ |
| RTL support | ❌ (declared, not impl.) | ✅ | ✅ |
| High contrast | ❌ (declared, not impl.) | ✅ | ✅ |
| npm weekly downloads | ~unknown | ~4M | ~500K |
| Time on market | < 1 year | 10+ years | 6+ years |
| Framework-agnostic core | ✅ | ❌ | ❌ |
| Headless core | ✅ (partial) | ❌ | ✅ (Headless Chakra in v3) |
| ESM + CJS | ✅ | ✅ | ✅ |
| SSR safe | ✅ | ✅ | ✅ |
| Polymorphic `as` | ✅ | ✅ | ✅ |
| Peer dep footprint | Minimal (React only) | Emotion (v5), Pigment (v6) | Panda CSS (v3) |

---

## 8. Pros and Cons

### ✅ Pros of TokisLib

1. **Genuinely zero-runtime** — No CSS-in-JS overhead. Precompiled CSS + CSS variables only. Faster than MUI v5, comparable to MUI v6 and Chakra v3.
2. **Best-in-class architectural clarity** — The 4-package layering (tokens → theme → core → react) is disciplined and enables future Vue/Svelte adapters without rewrites.
3. **CSS variable system is comprehensive** — 130+ CSS variables covering all design concerns (color, spacing, typography, radius, shadow, motion, z-index). Dark mode is first-class, zero-cost.
4. **Built-in charts without external dependency** — BarChart, LineChart (smooth + animated), PieChart/Donut, Sparkline — no need for Recharts/Chart.js for basic dashboards.
5. **Built-in VirtualizedList** — Window virtualization without `react-window` or `react-virtual`.
6. **CommandPalette built-in** — Most libraries don't include this. Tokis does, correctly implemented with keyboard nav, grouping, and shortcut display.
7. **Headless hooks** — `useDialog`, `usePopover`, `useMenu`, `useTabs` allow building custom styled overlays without forking the library.
8. **Accessibility foundations are strong** — Focus trap, roving tabindex, focus-visible, proper ARIA attributes throughout. Dialog, Tabs, Accordion, Menu are WAI-ARIA compliant.
9. **Minimal peer dependency footprint** — Only React 18 is required. No Emotion, no Panda CSS, no additional build configuration.
10. **Clean TypeScript** — Strict types, exported prop interfaces, generics used correctly.
11. **`useSnackbar` hook** — Clean imperative API for toast queues. Better DX than MUI's SnackbarProvider.
12. **Reduced motion by default** — CSS `@media (prefers-reduced-motion)` is in the base reset. Charts respect this too.
13. **State machine in core** — Even if underutilized currently, the foundation for deterministic component behavior is there.
14. **Single install** — `npm install tokis` is genuinely convenient.
15. **MIT licensed** — Free for commercial use.

### ❌ Cons of TokisLib

1. **Zero test coverage** — This is the single biggest risk. No unit tests, no integration tests, no visual regression tests. Every component is unverified beyond manual testing.
2. **No documentation** — No docs site, no Storybook, no interactive playground. Onboarding a new developer requires reading source code.
3. **Token layer is split/unsynchronized** — TypeScript primitive files and CSS variable files are maintained separately and are out of sync. CSS has 13 spacing steps; TS has 5. This causes confusion and potential drift.
4. **Incomplete headless core** — Only Button has a state machine in `@tokis/core`. All other complex components (Tabs, Accordion, Dialog, Menu, Popover) implement React state directly, breaking the headless architecture promise for those components.
5. **DataGrid is a stub** — Just wraps `<Table>`. No column resizing, sorting engine, filtering, row selection, pagination, or virtualization. Not comparable to MUI DataGrid.
6. **DatePicker is a stub** — Native HTML date input with a label. No calendar UI, no range picker, no time zone support.
7. **Icon system is placeholder** — `Icon` component uses Unicode characters. `MaterialIcon` renders a raw string. No SVG icon library is integrated. This must be solved before production use.
8. **RTL not implemented** — Declared as a requirement in AGENTS.md and ProjectPlan.md. Not a single CSS rule uses `dir="rtl"` or logical properties.
9. **No community or ecosystem** — 1 contributor vs 3000+ for MUI. No Stack Overflow answers. No third-party extensions, templates, or integrations.
10. **Inline styles in layout** — `Stack`, `Grid`, `Box` use `style={{gap: 'var(--tokis-spacing-4)'}}`. These bypass browser stylesheet caching and create new objects on every render.
11. **No accessibility audit** — Despite strong foundations, no third-party a11y audit has been done. Known gap: `useId` from core is not SSR-safe (uses global counter).
12. **Very young (v1.0.1)** — API stability is not guaranteed. Breaking changes are likely as the library matures.
13. **No CI/CD validation** — No GitHub Actions, no bundle size checks, no type-check in CI visible in the repo.
14. **`generate-css-vars.ts` is missing** — Referenced in the tokens index but the implementation file does not exist. The promise of auto-generating CSS from TS tokens is not fulfilled.
15. **Single barrel export performance** — All 100+ exports from one `index.ts` can cause IDE slowness in large projects.
16. **`Modal` in extended is unsafe** — The `Modal` component in `extended/index.tsx` lacks focus trap and scroll lock that the proper `Dialog` component has. Two implementations with inconsistent quality.

---

## 9. When Should You Use TokisLib?

### ✅ Use TokisLib When:

- **You are the original creator** and want to build something entirely your own with full architectural control
- **You need a zero-runtime CSS system** and are willing to tolerate early-stage roughness
- **You value token-first theming** and want to own the token pipeline end-to-end
- **You're building a SaaS dashboard** that needs charts + command palette + virtualization without adding 3 separate dependencies
- **You want framework-agnostic foundations** for a Vue/Svelte port later
- **You are evaluating headless + styled separation** as an architectural pattern
- **Bundle size is critical** and you cannot accept Emotion/Panda CSS overhead

### ❌ Do NOT Use TokisLib When:

- **You need production reliability today** — Zero test coverage is a hard blocker for production
- **Your team is more than 1–2 people** — Without docs or Storybook, onboarding is painful
- **You need a real DataGrid** — Use MUI X DataGrid or AG Grid
- **You need a real DatePicker** — Use MUI X Date Pickers or React Day Picker
- **You need RTL support** — Not implemented
- **You need battle-tested accessibility** — MUI and Chakra have years of audit history
- **You need community support** — No Stack Overflow presence, no Discord
- **You need long-term API stability** — v1.0.1 from a solo project carries high breaking change risk

---

## 10. Should You Switch to TokisLib from Material UI or Chakra UI?

### Short Answer: **Not Yet**

### Longer Answer:

**If you're currently on MUI v5 (Emotion):** The zero-runtime argument is compelling. But TokisLib's test coverage gap and missing documentation make it a net risk today. Wait until it has tests and a docs site.

**If you're currently on MUI v6 (Pigment CSS):** You've already solved the zero-runtime problem. TokisLib offers little upside and significant downside risk (no tests, no DataGrid, no DatePicker).

**If you're currently on Chakra UI v3 (Panda CSS):** Chakra's composition model and token system are more mature. Tokis has similar ideas but less polish and zero tests.

**If you're starting a new project:** Consider TokisLib's approach as an *architectural reference* — then either build on top of it (accepting its limitations) or use it as inspiration for a Chakra v3 or Radix UI setup that achieves the same zero-runtime token goals with production reliability.

### The One Compelling Case for TokisLib

If you are **this project's creator** or a very small team that values:
1. Complete ownership of the design system
2. Zero runtime overhead
3. Token-native architecture
4. Built-in charts and command palette

...then Tokis is worth investing in. The architecture is genuinely good. The code quality is consistently high. The gaps are known and fixable. The path from "impressive prototype" to "production-ready library" requires:

1. Test suite (Vitest + Testing Library)
2. Documentation site (Storybook or VitePress)
3. Token synchronization (auto-generate CSS from TS tokens)
4. A real icon system (integrate Lucide or Phosphor)
5. RTL pass on CSS (logical properties)
6. DataGrid and DatePicker (or honest deprecation in favor of composability)

---

## 11. Test Execution Analysis

> ℹ️ **WRITE mode note**: Tests cannot be executed in WRITE mode. The following is a static analysis of what tests *would* reveal.

### Current Test Status

**Zero test files exist in the repository.** No `*.test.ts`, `*.spec.ts`, `*.test.tsx`, or `*.spec.tsx` files were found. No `jest.config.*`, `vitest.config.*`, or `playwright.config.*` files exist.

### What Tests Would Find

Based on static analysis of the source:

| Component | Expected Test Result | Potential Issues |
|---|---|---|
| `ButtonRoot` | Would pass basic render/click | `send(PRESS)` + `send(RELEASE)` in same tick is effectively a no-op state machine call |
| `Dialog` | Would pass focus trap | Focus trap on empty dialog (no focusable children) returns early — `contentRef.current?.focus()` then fails silently |
| `Accordion` | Would pass controlled mode | `onChange` returns `''` when collapsible=true and no item open — empty string vs undefined inconsistency |
| `Tabs` | Would pass keyboard nav | `handleKeyDown` requires `values` prop to be passed; without it, arrow keys silently do nothing |
| `Tooltip` | Would pass hover | Positioning uses `rect.top/left` + `window.scrollY` — fails in `position: fixed` containers |
| `VirtualizedList` | Would pass render | `totalHeight` with 0 items renders `height: 0` — no empty state |
| `useId` (core) | Would fail SSR | Global counter increments server-side — client IDs will not match causing hydration mismatch |
| `Chip` (delete) | Would pass | aria-label is "Remove" — not descriptive of *what* is being removed |
| `Charts` | Would pass render | SVG not announced to screen readers beyond `aria-label="Bar chart"` — data values not accessible |

---

## 12. Architectural Verdict

TokisLib is the best-designed 1.0 design system I've analyzed architecturally. The layering, token system, headless core pattern, and component API choices reflect Staff-level architectural discipline.

However, architectural discipline alone does not make a library production-ready. The absence of tests is the critical failure. A design system without tests is a design system that will silently regress.

**Architectural Score: 9/10**
**Production Readiness Score: 3/10**
**"Should you use it today?" Score: 4/10**

The right move is to invest in closing the gaps rather than abandoning the architecture.

---

## 13. Recommendations

### Immediate (Before any production use)

1. **Add tests** — Start with `vitest` + `@testing-library/react`. Minimum: Dialog (focus trap), Button (click/disabled/loading), Tabs (keyboard), TextField (error/label association).
2. **Fix SSR `useId`** — The custom `useId` hook from core uses a global counter. Switch all internal usage to React 18's `useId()` (already done in most components — ensure the custom one is not used internally).
3. **Add a Storybook** — Without visual documentation, the library cannot be adopted by designers or other developers.

### Short-Term (1–3 months)

4. **Synchronize tokens** — Implement `generate-css-vars.ts` to auto-generate `variables.css` from the TypeScript token definitions. Remove manual duplication.
5. **Replace emoji icons** — Integrate Lucide React or Phosphor Icons as optional peer dependencies.
6. **RTL pass** — Replace directional CSS (`padding-left`, `margin-right`, etc.) with logical properties (`padding-inline-start`, `margin-inline-end`).
7. **Extend headless core** — Move Dialog, Tabs, Accordion, and Menu state logic into `@tokis/core` state machines to fulfill the headless architecture promise.

### Medium-Term (3–6 months)

8. **Real DatePicker** — Integrate or build a calendar-based date picker. The native input wrapper is inadequate.
9. **Real DataGrid** — Build a proper grid with sorting, filtering, pagination, and virtualized rows using the existing `VirtualizedList`.
10. **Bundle size tracking** — Add `size-limit` to CI to prevent bundle regressions.
11. **Accessibility audit** — Commission or perform a formal WCAG 2.1 AA audit.

---

*Analysis performed by static code inspection of all 50+ source files across 5 packages. Tests could not be executed (WRITE mode). Last analyzed: TokisLib v1.0.1.*
