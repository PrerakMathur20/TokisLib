import { describe, it, expect } from 'vitest';
import {
  menuMachine,
  reduceMenuContext,
  getMenuTriggerAriaProps,
  getMenuAriaProps,
  getMenuItemAriaProps,
} from '../primitives/menu/menu.machine.js';
import type { MenuContext } from '../primitives/menu/menu.types.js';

// ─── Fixtures ──────────────────────────────────────────────────────────────

const items = [
  { id: 'file',   label: 'File',   disabled: false },
  { id: 'edit',   label: 'Edit',   disabled: false },
  { id: 'view',   label: 'View',   disabled: true  },
  { id: 'help',   label: 'Help',   disabled: false },
];

function makeCtx(overrides: Partial<MenuContext> = {}): MenuContext {
  return {
    triggerId: 'menu-trigger',
    items,
    activeItemId: null,
    searchBuffer: '',
    loop: true,
    ...overrides,
  };
}

// ─── State machine transitions ─────────────────────────────────────────────

describe('menuMachine transitions', () => {
  it('starts closed', () => {
    expect(menuMachine.initialState).toBe('closed');
  });

  it('closed + OPEN → open', () => {
    expect(menuMachine.transition('closed', 'OPEN')).toBe('open');
  });

  it('closed + TOGGLE → open', () => {
    expect(menuMachine.transition('closed', 'TOGGLE')).toBe('open');
  });

  it('open + CLOSE → closed', () => {
    expect(menuMachine.transition('open', 'CLOSE')).toBe('closed');
  });

  it('open + TOGGLE → closed', () => {
    expect(menuMachine.transition('open', 'TOGGLE')).toBe('closed');
  });

  it('open + SELECT_ITEM → closed (menu dismisses on selection)', () => {
    expect(menuMachine.transition('open', 'SELECT_ITEM')).toBe('closed');
  });
});

// ─── Context helpers ───────────────────────────────────────────────────────

describe('reduceMenuContext — OPEN', () => {
  it('focuses the first enabled item on open', () => {
    const ctx = makeCtx();
    const patch = reduceMenuContext(ctx, 'OPEN');
    expect(patch.activeItemId).toBe('file');
    expect(patch.searchBuffer).toBe('');
  });
});

describe('reduceMenuContext — CLOSE/TOGGLE', () => {
  it('CLOSE clears activeItemId and searchBuffer', () => {
    const ctx = makeCtx({ activeItemId: 'edit', searchBuffer: 'ed' });
    const patch = reduceMenuContext(ctx, 'CLOSE');
    expect(patch.activeItemId).toBeNull();
    expect(patch.searchBuffer).toBe('');
  });

  it('TOGGLE clears activeItemId and searchBuffer', () => {
    const ctx = makeCtx({ activeItemId: 'edit' });
    const patch = reduceMenuContext(ctx, 'TOGGLE');
    expect(patch.activeItemId).toBeNull();
  });
});

describe('reduceMenuContext — NEXT_ITEM / PREV_ITEM', () => {
  it('NEXT_ITEM skips disabled items', () => {
    // file → edit (skip view which is disabled) → help → file (loop)
    const ctx = makeCtx({ activeItemId: 'edit' });
    const patch = reduceMenuContext(ctx, 'NEXT_ITEM');
    // 'view' is disabled, so it should jump to 'help'
    expect(patch.activeItemId).toBe('help');
  });

  it('NEXT_ITEM loops back to first enabled when at end (loop=true)', () => {
    const ctx = makeCtx({ activeItemId: 'help', loop: true });
    const patch = reduceMenuContext(ctx, 'NEXT_ITEM');
    expect(patch.activeItemId).toBe('file');
  });

  it('NEXT_ITEM stays at last when loop=false', () => {
    const ctx = makeCtx({ activeItemId: 'help', loop: false });
    const patch = reduceMenuContext(ctx, 'NEXT_ITEM');
    expect(patch.activeItemId).toBe('help');
  });

  it('PREV_ITEM moves to the previous enabled item', () => {
    const ctx = makeCtx({ activeItemId: 'help' });
    const patch = reduceMenuContext(ctx, 'PREV_ITEM');
    // view is disabled, so should skip to 'edit'
    expect(patch.activeItemId).toBe('edit');
  });

  it('PREV_ITEM wraps to last enabled item from first (loop=true)', () => {
    const ctx = makeCtx({ activeItemId: 'file', loop: true });
    const patch = reduceMenuContext(ctx, 'PREV_ITEM');
    expect(patch.activeItemId).toBe('help');
  });
});

describe('reduceMenuContext — FIRST_ITEM / LAST_ITEM', () => {
  it('FIRST_ITEM focuses the first enabled item', () => {
    const ctx = makeCtx({ activeItemId: 'help' });
    const patch = reduceMenuContext(ctx, 'FIRST_ITEM');
    expect(patch.activeItemId).toBe('file');
  });

  it('LAST_ITEM focuses the last enabled item', () => {
    const ctx = makeCtx({ activeItemId: 'file' });
    const patch = reduceMenuContext(ctx, 'LAST_ITEM');
    expect(patch.activeItemId).toBe('help');
  });
});

describe('reduceMenuContext — SEARCH (typeahead)', () => {
  it('finds the first item starting with the typed character', () => {
    const ctx = makeCtx({ activeItemId: null });
    const patch = reduceMenuContext(ctx, 'SEARCH', { char: 'e' });
    expect(patch.activeItemId).toBe('edit');
    expect(patch.searchBuffer).toBe('e');
  });

  it('accumulates characters in searchBuffer', () => {
    const ctx = makeCtx({ activeItemId: 'edit', searchBuffer: 'e' });
    const patch = reduceMenuContext(ctx, 'SEARCH', { char: 'd' });
    expect(patch.searchBuffer).toBe('ed');
    expect(patch.activeItemId).toBe('edit');
  });

  it('is case-insensitive', () => {
    const ctx = makeCtx();
    const patch = reduceMenuContext(ctx, 'SEARCH', { char: 'H' });
    expect(patch.activeItemId).toBe('help');
  });

  it('keeps current activeItemId when no match is found', () => {
    const ctx = makeCtx({ activeItemId: 'file' });
    const patch = reduceMenuContext(ctx, 'SEARCH', { char: 'z' });
    expect(patch.activeItemId).toBe('file');
  });

  it('returns empty patch for empty char', () => {
    const ctx = makeCtx();
    const patch = reduceMenuContext(ctx, 'SEARCH', { char: '' });
    expect(patch).toEqual({});
  });
});

// ─── ARIA helpers ──────────────────────────────────────────────────────────

describe('getMenuTriggerAriaProps', () => {
  it('returns aria-expanded=false when menu is closed', () => {
    const ctx = makeCtx();
    const props = getMenuTriggerAriaProps('closed', ctx, 'menu-list');
    expect(props['aria-expanded']).toBe(false);
    expect(props['aria-haspopup']).toBe('menu');
    expect(props['aria-controls']).toBe('menu-list');
  });

  it('returns aria-expanded=true when menu is open', () => {
    const ctx = makeCtx();
    const props = getMenuTriggerAriaProps('open', ctx, 'menu-list');
    expect(props['aria-expanded']).toBe(true);
  });
});

describe('getMenuAriaProps', () => {
  it('returns role=menu with aria-labelledby pointing to trigger', () => {
    const ctx = makeCtx({ triggerId: 'my-trigger' });
    const props = getMenuAriaProps(ctx, 'my-menu');
    expect(props.role).toBe('menu');
    expect(props['aria-labelledby']).toBe('my-trigger');
    expect(props.id).toBe('my-menu');
  });
});

describe('getMenuItemAriaProps', () => {
  it('marks the active item with tabIndex=0', () => {
    const ctx = makeCtx({ activeItemId: 'file' });
    const props = getMenuItemAriaProps(ctx, items[0]);
    expect(props.role).toBe('menuitem');
    expect(props.tabIndex).toBe(0);
    expect(props['aria-disabled']).toBe(false);
  });

  it('marks non-active items with tabIndex=-1', () => {
    const ctx = makeCtx({ activeItemId: 'file' });
    const props = getMenuItemAriaProps(ctx, items[1]); // 'edit'
    expect(props.tabIndex).toBe(-1);
  });

  it('marks disabled items with aria-disabled=true', () => {
    const ctx = makeCtx({ activeItemId: 'view' });
    const props = getMenuItemAriaProps(ctx, items[2]); // 'view' is disabled
    expect(props['aria-disabled']).toBe(true);
  });
});
