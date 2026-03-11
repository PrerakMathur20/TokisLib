import { describe, it, expect } from 'vitest';
import {
  reduceAccordionContext,
  isAccordionItemOpen,
  getAccordionTriggerAriaProps,
} from '../primitives/accordion/accordion.machine.js';
import type { AccordionContext } from '../primitives/accordion/accordion.types.js';

// ─── Fixtures ──────────────────────────────────────────────────────────────

function makeCtx(overrides: Partial<AccordionContext> = {}): AccordionContext {
  return {
    itemIds: ['item-1', 'item-2', 'item-3'],
    openItemIds: new Set<string>(),
    multiple: false,
    collapsible: true,
    ...overrides,
  };
}

// ─── TOGGLE_ITEM ───────────────────────────────────────────────────────────

describe('reduceAccordionContext — TOGGLE_ITEM', () => {
  it('opens a closed item', () => {
    const ctx = makeCtx();
    const patch = reduceAccordionContext(ctx, 'TOGGLE_ITEM', { itemId: 'item-1' });
    expect(patch.openItemIds?.has('item-1')).toBe(true);
  });

  it('closes an open item when collapsible=true', () => {
    const ctx = makeCtx({ openItemIds: new Set(['item-1']) });
    const patch = reduceAccordionContext(ctx, 'TOGGLE_ITEM', { itemId: 'item-1' });
    expect(patch.openItemIds?.has('item-1')).toBe(false);
  });

  it('prevents closing the last item when collapsible=false', () => {
    const ctx = makeCtx({ openItemIds: new Set(['item-1']), collapsible: false });
    const patch = reduceAccordionContext(ctx, 'TOGGLE_ITEM', { itemId: 'item-1' });
    // Should return empty patch — item stays open
    expect(patch).toEqual({});
  });

  it('exclusive mode: opening one item closes all others', () => {
    const ctx = makeCtx({ openItemIds: new Set(['item-1']), multiple: false });
    const patch = reduceAccordionContext(ctx, 'TOGGLE_ITEM', { itemId: 'item-2' });
    expect(patch.openItemIds?.has('item-2')).toBe(true);
    expect(patch.openItemIds?.has('item-1')).toBe(false);
  });

  it('multiple mode: opening one item leaves others open', () => {
    const ctx = makeCtx({ openItemIds: new Set(['item-1']), multiple: true });
    const patch = reduceAccordionContext(ctx, 'TOGGLE_ITEM', { itemId: 'item-2' });
    expect(patch.openItemIds?.has('item-1')).toBe(true);
    expect(patch.openItemIds?.has('item-2')).toBe(true);
  });

  it('returns empty patch when no itemId is provided', () => {
    const ctx = makeCtx();
    const patch = reduceAccordionContext(ctx, 'TOGGLE_ITEM');
    expect(patch).toEqual({});
  });
});

// ─── OPEN_ITEM / CLOSE_ITEM ────────────────────────────────────────────────

describe('reduceAccordionContext — OPEN_ITEM / CLOSE_ITEM', () => {
  it('OPEN_ITEM adds the item to open set (exclusive mode clears others)', () => {
    const ctx = makeCtx({ openItemIds: new Set(['item-1']), multiple: false });
    const patch = reduceAccordionContext(ctx, 'OPEN_ITEM', { itemId: 'item-2' });
    expect(patch.openItemIds?.has('item-2')).toBe(true);
    expect(patch.openItemIds?.has('item-1')).toBe(false);
  });

  it('OPEN_ITEM in multiple mode preserves existing open items', () => {
    const ctx = makeCtx({ openItemIds: new Set(['item-1']), multiple: true });
    const patch = reduceAccordionContext(ctx, 'OPEN_ITEM', { itemId: 'item-2' });
    expect(patch.openItemIds?.has('item-1')).toBe(true);
    expect(patch.openItemIds?.has('item-2')).toBe(true);
  });

  it('CLOSE_ITEM removes an open item', () => {
    const ctx = makeCtx({ openItemIds: new Set(['item-1', 'item-2']), multiple: true });
    const patch = reduceAccordionContext(ctx, 'CLOSE_ITEM', { itemId: 'item-1' });
    expect(patch.openItemIds?.has('item-1')).toBe(false);
    expect(patch.openItemIds?.has('item-2')).toBe(true);
  });

  it('CLOSE_ITEM is a no-op when collapsible=false and only one item is open', () => {
    const ctx = makeCtx({ openItemIds: new Set(['item-1']), collapsible: false });
    const patch = reduceAccordionContext(ctx, 'CLOSE_ITEM', { itemId: 'item-1' });
    expect(patch).toEqual({});
  });
});

// ─── OPEN_ALL / CLOSE_ALL ──────────────────────────────────────────────────

describe('reduceAccordionContext — OPEN_ALL / CLOSE_ALL', () => {
  it('OPEN_ALL opens every item when multiple=true', () => {
    const ctx = makeCtx({ multiple: true });
    const patch = reduceAccordionContext(ctx, 'OPEN_ALL');
    expect(patch.openItemIds?.size).toBe(3);
    ctx.itemIds.forEach((id) => {
      expect(patch.openItemIds?.has(id)).toBe(true);
    });
  });

  it('OPEN_ALL is a no-op in exclusive mode', () => {
    const ctx = makeCtx({ multiple: false });
    const patch = reduceAccordionContext(ctx, 'OPEN_ALL');
    expect(patch).toEqual({});
  });

  it('CLOSE_ALL clears all open items when collapsible=true', () => {
    const ctx = makeCtx({ openItemIds: new Set(['item-1', 'item-2']), multiple: true, collapsible: true });
    const patch = reduceAccordionContext(ctx, 'CLOSE_ALL');
    expect(patch.openItemIds?.size).toBe(0);
  });

  it('CLOSE_ALL is a no-op when collapsible=false', () => {
    const ctx = makeCtx({ openItemIds: new Set(['item-1']), collapsible: false });
    const patch = reduceAccordionContext(ctx, 'CLOSE_ALL');
    expect(patch).toEqual({});
  });
});

// ─── isAccordionItemOpen ───────────────────────────────────────────────────

describe('isAccordionItemOpen', () => {
  it('returns true for an item in openItemIds', () => {
    const ctx = makeCtx({ openItemIds: new Set(['item-2']) });
    expect(isAccordionItemOpen(ctx, 'item-2')).toBe(true);
  });

  it('returns false for an item not in openItemIds', () => {
    const ctx = makeCtx({ openItemIds: new Set(['item-2']) });
    expect(isAccordionItemOpen(ctx, 'item-1')).toBe(false);
  });
});

// ─── ARIA helpers ──────────────────────────────────────────────────────────

describe('getAccordionTriggerAriaProps', () => {
  it('returns aria-expanded=true for an open item', () => {
    const ctx = makeCtx({ openItemIds: new Set(['item-1']) });
    const props = getAccordionTriggerAriaProps(ctx, 'item-1', 'panel-1');
    expect(props['aria-expanded']).toBe(true);
    expect(props['aria-controls']).toBe('panel-1');
    expect(props.role).toBe('button');
  });

  it('returns aria-expanded=false for a closed item', () => {
    const ctx = makeCtx();
    const props = getAccordionTriggerAriaProps(ctx, 'item-1', 'panel-1');
    expect(props['aria-expanded']).toBe(false);
  });
});
