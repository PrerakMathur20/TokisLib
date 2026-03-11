import { describe, it, expect } from 'vitest';
import {
  tabsMachine,
  reduceTabsContext,
  getNextTabId,
  getPrevTabId,
  getTabAriaProps,
  getTabPanelAriaProps,
} from '../primitives/tabs/tabs.machine.js';
import type { TabsContext } from '../primitives/tabs/tabs.types.js';

// ─── Fixtures ──────────────────────────────────────────────────────────────

function makeCtx(overrides: Partial<TabsContext> = {}): TabsContext {
  return {
    tabIds: ['tab-1', 'tab-2', 'tab-3'],
    activeTabId: 'tab-1',
    focusedTabId: 'tab-1',
    activationMode: 'automatic',
    orientation: 'horizontal',
    loop: true,
    ...overrides,
  };
}

// ─── Machine tests ─────────────────────────────────────────────────────────

describe('tabsMachine', () => {
  it('starts in idle state', () => {
    expect(tabsMachine.initialState).toBe('idle');
  });

  it('stays in idle on any event (all context work is done by helpers)', () => {
    expect(tabsMachine.transition('idle', 'SELECT_TAB')).toBe('idle');
    expect(tabsMachine.transition('idle', 'NEXT_TAB')).toBe('idle');
    expect(tabsMachine.transition('idle', 'PREV_TAB')).toBe('idle');
  });
});

// ─── Navigation helpers ────────────────────────────────────────────────────

describe('getNextTabId', () => {
  it('moves from first → second tab', () => {
    const ctx = makeCtx({ focusedTabId: 'tab-1' });
    expect(getNextTabId(ctx)).toBe('tab-2');
  });

  it('moves from second → third tab', () => {
    const ctx = makeCtx({ focusedTabId: 'tab-2' });
    expect(getNextTabId(ctx)).toBe('tab-3');
  });

  it('wraps from last → first when loop=true', () => {
    const ctx = makeCtx({ focusedTabId: 'tab-3', loop: true });
    expect(getNextTabId(ctx)).toBe('tab-1');
  });

  it('stays at last tab when loop=false', () => {
    const ctx = makeCtx({ focusedTabId: 'tab-3', loop: false });
    expect(getNextTabId(ctx)).toBe('tab-3');
  });

  it('returns first tab when current focus is not in tabIds', () => {
    const ctx = makeCtx({ focusedTabId: 'unknown' });
    expect(getNextTabId(ctx)).toBe('tab-1');
  });
});

describe('getPrevTabId', () => {
  it('moves from third → second tab', () => {
    const ctx = makeCtx({ focusedTabId: 'tab-3' });
    expect(getPrevTabId(ctx)).toBe('tab-2');
  });

  it('wraps from first → last when loop=true', () => {
    const ctx = makeCtx({ focusedTabId: 'tab-1', loop: true });
    expect(getPrevTabId(ctx)).toBe('tab-3');
  });

  it('stays at first tab when loop=false', () => {
    const ctx = makeCtx({ focusedTabId: 'tab-1', loop: false });
    expect(getPrevTabId(ctx)).toBe('tab-1');
  });
});

// ─── reduceTabsContext ─────────────────────────────────────────────────────

describe('reduceTabsContext', () => {
  it('SELECT_TAB with payload sets activeTabId and focusedTabId', () => {
    const ctx = makeCtx();
    const patch = reduceTabsContext(ctx, 'SELECT_TAB', { tabId: 'tab-2' });
    expect(patch).toEqual({ activeTabId: 'tab-2', focusedTabId: 'tab-2' });
  });

  it('SELECT_TAB without payload uses current focusedTabId', () => {
    const ctx = makeCtx({ focusedTabId: 'tab-3' });
    const patch = reduceTabsContext(ctx, 'SELECT_TAB');
    expect(patch).toEqual({ activeTabId: 'tab-3', focusedTabId: 'tab-3' });
  });

  it('FOCUS_TAB in automatic mode also updates activeTabId', () => {
    const ctx = makeCtx({ activationMode: 'automatic' });
    const patch = reduceTabsContext(ctx, 'FOCUS_TAB', { tabId: 'tab-2' });
    expect(patch.focusedTabId).toBe('tab-2');
    expect(patch.activeTabId).toBe('tab-2');
  });

  it('FOCUS_TAB in manual mode only updates focusedTabId', () => {
    const ctx = makeCtx({ activationMode: 'manual' });
    const patch = reduceTabsContext(ctx, 'FOCUS_TAB', { tabId: 'tab-2' });
    expect(patch.focusedTabId).toBe('tab-2');
    expect(patch.activeTabId).toBeUndefined();
  });

  it('NEXT_TAB advances focus in automatic mode', () => {
    const ctx = makeCtx({ focusedTabId: 'tab-1', activationMode: 'automatic' });
    const patch = reduceTabsContext(ctx, 'NEXT_TAB');
    expect(patch.focusedTabId).toBe('tab-2');
    expect(patch.activeTabId).toBe('tab-2');
  });

  it('PREV_TAB moves focus backward', () => {
    const ctx = makeCtx({ focusedTabId: 'tab-2' });
    const patch = reduceTabsContext(ctx, 'PREV_TAB');
    expect(patch.focusedTabId).toBe('tab-1');
  });

  it('FIRST_TAB jumps to first tab', () => {
    const ctx = makeCtx({ focusedTabId: 'tab-3' });
    const patch = reduceTabsContext(ctx, 'FIRST_TAB');
    expect(patch.focusedTabId).toBe('tab-1');
  });

  it('LAST_TAB jumps to last tab', () => {
    const ctx = makeCtx({ focusedTabId: 'tab-1' });
    const patch = reduceTabsContext(ctx, 'LAST_TAB');
    expect(patch.focusedTabId).toBe('tab-3');
  });

  it('unknown event returns empty patch (no-op)', () => {
    const ctx = makeCtx();
    // @ts-expect-error — intentional unknown event
    const patch = reduceTabsContext(ctx, 'UNKNOWN_EVENT');
    expect(patch).toEqual({});
  });
});

// ─── ARIA helpers ──────────────────────────────────────────────────────────

describe('getTabAriaProps', () => {
  it('returns correct ARIA attributes for the active tab', () => {
    const ctx = makeCtx({ activeTabId: 'tab-1' });
    const props = getTabAriaProps(ctx, 'tab-1', 'panel-1');
    expect(props.role).toBe('tab');
    expect(props['aria-selected']).toBe(true);
    expect(props['aria-controls']).toBe('panel-1');
    expect(props.tabIndex).toBe(0);
  });

  it('marks non-active tabs as not selected with tabIndex -1', () => {
    const ctx = makeCtx({ activeTabId: 'tab-1' });
    const props = getTabAriaProps(ctx, 'tab-2', 'panel-2');
    expect(props['aria-selected']).toBe(false);
    expect(props.tabIndex).toBe(-1);
  });
});

describe('getTabPanelAriaProps', () => {
  it('returns correct ARIA attributes for the visible panel', () => {
    const ctx = makeCtx({ activeTabId: 'tab-1' });
    const props = getTabPanelAriaProps(ctx, 'panel-1', 'tab-1');
    expect(props.role).toBe('tabpanel');
    expect(props.hidden).toBe(false);
    expect(props['aria-labelledby']).toBe('tab-1');
    expect(props.tabIndex).toBe(0);
  });

  it('marks non-visible panels as hidden', () => {
    const ctx = makeCtx({ activeTabId: 'tab-1' });
    const props = getTabPanelAriaProps(ctx, 'panel-2', 'tab-2');
    expect(props.hidden).toBe(true);
  });
});
