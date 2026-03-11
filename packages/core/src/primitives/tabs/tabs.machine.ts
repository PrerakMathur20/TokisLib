import { createMachine } from '../../state/create-machine.js';
import type { TabsContext, TabsState, TabsEventType } from './tabs.types.js';

/**
 * Tabs state machine.
 *
 * The macro-state is always 'idle' — active/focused tab is tracked via context.
 * Pure helper functions below handle context transitions and are designed to
 * work with `useState` / `useReducer` in framework adapters.
 */
export const tabsMachine = createMachine<TabsState, TabsEventType, TabsContext>({
  id: 'tabs',
  initial: 'idle',
  context: {
    tabIds: [],
    activeTabId: '',
    focusedTabId: '',
    activationMode: 'automatic',
    orientation: 'horizontal',
    loop: true,
  },
  states: {
    // All events stay in idle; context manipulation is done via helpers below.
    idle: {},
  },
});

// ─── Pure context helpers ──────────────────────────────────────────────────

/** Returns the next tab id in the ordered list, with optional looping. */
export function getNextTabId(ctx: TabsContext): string {
  const { tabIds, focusedTabId, loop } = ctx;
  const idx = tabIds.indexOf(focusedTabId);
  if (idx === -1) return tabIds[0] ?? focusedTabId;
  const next = idx + 1;
  if (next >= tabIds.length) return loop ? (tabIds[0] ?? focusedTabId) : (tabIds[tabIds.length - 1] ?? focusedTabId);
  return tabIds[next] ?? focusedTabId;
}

/** Returns the previous tab id in the ordered list, with optional looping. */
export function getPrevTabId(ctx: TabsContext): string {
  const { tabIds, focusedTabId, loop } = ctx;
  const idx = tabIds.indexOf(focusedTabId);
  if (idx === -1) return tabIds[tabIds.length - 1] ?? focusedTabId;
  const prev = idx - 1;
  if (prev < 0) return loop ? (tabIds[tabIds.length - 1] ?? focusedTabId) : (tabIds[0] ?? focusedTabId);
  return tabIds[prev] ?? focusedTabId;
}

/**
 * Reduces a tabs event into a new partial context.
 * Framework adapters call this and merge the result into their state.
 */
export function reduceTabsContext(
  ctx: TabsContext,
  event: TabsEventType,
  payload?: { tabId?: string },
): Partial<TabsContext> {
  switch (event) {
    case 'SELECT_TAB': {
      const id = payload?.tabId ?? ctx.focusedTabId;
      return { activeTabId: id, focusedTabId: id };
    }
    case 'FOCUS_TAB': {
      const id = payload?.tabId ?? ctx.focusedTabId;
      const changes: Partial<TabsContext> = { focusedTabId: id };
      if (ctx.activationMode === 'automatic') changes.activeTabId = id;
      return changes;
    }
    case 'NEXT_TAB': {
      const id = getNextTabId(ctx);
      const changes: Partial<TabsContext> = { focusedTabId: id };
      if (ctx.activationMode === 'automatic') changes.activeTabId = id;
      return changes;
    }
    case 'PREV_TAB': {
      const id = getPrevTabId(ctx);
      const changes: Partial<TabsContext> = { focusedTabId: id };
      if (ctx.activationMode === 'automatic') changes.activeTabId = id;
      return changes;
    }
    case 'FIRST_TAB': {
      const id = ctx.tabIds[0] ?? ctx.focusedTabId;
      const changes: Partial<TabsContext> = { focusedTabId: id };
      if (ctx.activationMode === 'automatic') changes.activeTabId = id;
      return changes;
    }
    case 'LAST_TAB': {
      const id = ctx.tabIds[ctx.tabIds.length - 1] ?? ctx.focusedTabId;
      const changes: Partial<TabsContext> = { focusedTabId: id };
      if (ctx.activationMode === 'automatic') changes.activeTabId = id;
      return changes;
    }
    default:
      return {};
  }
}

/** Returns the ARIA attributes for a tab element. */
export function getTabAriaProps(
  ctx: TabsContext,
  tabId: string,
  panelId: string,
): Record<string, string | boolean | number> {
  return {
    role: 'tab',
    id: tabId,
    'aria-controls': panelId,
    'aria-selected': ctx.activeTabId === tabId,
    tabIndex: ctx.activeTabId === tabId ? 0 : -1,
  };
}

/** Returns the ARIA attributes for a tab panel element. */
export function getTabPanelAriaProps(
  ctx: TabsContext,
  panelId: string,
  tabId: string,
): Record<string, string | boolean | number> {
  return {
    role: 'tabpanel',
    id: panelId,
    'aria-labelledby': tabId,
    tabIndex: 0,
    hidden: ctx.activeTabId !== tabId,
  };
}
