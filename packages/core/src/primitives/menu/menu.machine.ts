import { createMachine } from '../../state/create-machine.js';
import type { MenuContext, MenuState, MenuEventType, MenuItemDescriptor } from './menu.types.js';

/**
 * Menu state machine.
 *
 * Transition table:
 *   closed + OPEN   → open
 *   closed + TOGGLE → open
 *   open   + CLOSE  → closed
 *   open   + TOGGLE → closed
 *   open   + SELECT_ITEM → closed
 *   (all other events keep current state, context mutated via helpers)
 */
export const menuMachine = createMachine<MenuState, MenuEventType, MenuContext>({
  id: 'menu',
  initial: 'closed',
  context: {
    triggerId: 'menu-trigger',
    items: [],
    activeItemId: null,
    searchBuffer: '',
    loop: true,
  },
  states: {
    closed: {
      OPEN:   'open',
      TOGGLE: 'open',
    },
    open: {
      CLOSE:       'closed',
      TOGGLE:      'closed',
      SELECT_ITEM: 'closed',
    },
  },
});

// ─── Pure context helpers ──────────────────────────────────────────────────

function enabledItems(items: MenuItemDescriptor[]): MenuItemDescriptor[] {
  return items.filter((i) => !i.disabled);
}

function getActiveIndex(ctx: MenuContext): number {
  if (!ctx.activeItemId) return -1;
  return enabledItems(ctx.items).findIndex((i) => i.id === ctx.activeItemId);
}

/** Handles navigation and search events, returning updated context fields. */
export function reduceMenuContext(
  ctx: MenuContext,
  event: MenuEventType,
  payload?: { itemId?: string; char?: string },
): Partial<MenuContext> {
  const enabled = enabledItems(ctx.items);

  switch (event) {
    case 'OPEN': {
      // Focus first item on open
      const first = enabled[0];
      return { activeItemId: first?.id ?? null, searchBuffer: '' };
    }

    case 'CLOSE':
    case 'TOGGLE': {
      return { activeItemId: null, searchBuffer: '' };
    }

    case 'FOCUS_ITEM': {
      return { activeItemId: payload?.itemId ?? null };
    }

    case 'SELECT_ITEM': {
      return { activeItemId: null, searchBuffer: '' };
    }

    case 'NEXT_ITEM': {
      const idx = getActiveIndex(ctx);
      let next = idx + 1;
      if (next >= enabled.length) next = ctx.loop ? 0 : enabled.length - 1;
      return { activeItemId: enabled[next]?.id ?? null };
    }

    case 'PREV_ITEM': {
      const idx = getActiveIndex(ctx);
      let prev = idx - 1;
      if (prev < 0) prev = ctx.loop ? enabled.length - 1 : 0;
      return { activeItemId: enabled[prev]?.id ?? null };
    }

    case 'FIRST_ITEM': {
      return { activeItemId: enabled[0]?.id ?? null };
    }

    case 'LAST_ITEM': {
      return { activeItemId: enabled[enabled.length - 1]?.id ?? null };
    }

    case 'SEARCH': {
      const char = (payload?.char ?? '').toLowerCase();
      if (!char) return {};

      // Accumulate typeahead buffer (cleared by timeout in adapter)
      const buffer = ctx.searchBuffer + char;
      const currentIdx = getActiveIndex(ctx);

      // Find next item starting with buffer, searching from after current
      const startIdx = currentIdx + 1;
      const rotated = [...enabled.slice(startIdx), ...enabled.slice(0, startIdx)];
      const match = rotated.find((i) => i.label.toLowerCase().startsWith(buffer));

      return {
        searchBuffer: buffer,
        activeItemId: match?.id ?? ctx.activeItemId,
      };
    }

    default:
      return {};
  }
}

/** ARIA attributes for the menu trigger button. */
export function getMenuTriggerAriaProps(
  state: MenuState,
  ctx: MenuContext,
  menuId: string,
): Record<string, string | boolean> {
  return {
    'aria-haspopup': 'menu',
    'aria-expanded': state === 'open',
    'aria-controls': menuId,
    id: ctx.triggerId,
  };
}

/** ARIA attributes for the menu container (ul element). */
export function getMenuAriaProps(
  ctx: MenuContext,
  menuId: string,
): Record<string, string> {
  return {
    role: 'menu',
    id: menuId,
    'aria-labelledby': ctx.triggerId,
  };
}

/** ARIA attributes for a single menu item. */
export function getMenuItemAriaProps(
  ctx: MenuContext,
  item: MenuItemDescriptor,
): Record<string, string | boolean | number> {
  return {
    role: 'menuitem',
    id: item.id,
    'aria-disabled': item.disabled ?? false,
    tabIndex: ctx.activeItemId === item.id ? 0 : -1,
  };
}
