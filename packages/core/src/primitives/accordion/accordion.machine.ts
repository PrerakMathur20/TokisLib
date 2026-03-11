import { createMachine } from '../../state/create-machine.js';
import type { AccordionContext, AccordionState, AccordionEventType } from './accordion.types.js';

/**
 * Accordion state machine.
 *
 * Like tabs, the macro-state is always 'idle'. Open/closed state per item
 * lives in context.openItemIds. Use `reduceAccordionContext` in adapters.
 */
export const accordionMachine = createMachine<AccordionState, AccordionEventType, AccordionContext>({
  id: 'accordion',
  initial: 'idle',
  context: {
    itemIds: [],
    openItemIds: new Set(),
    multiple: false,
    collapsible: true,
  },
  states: {
    idle: {},
  },
});

// ─── Pure context helpers ──────────────────────────────────────────────────

/**
 * Reduces an accordion event into a new openItemIds set.
 * Returns the full updated context for easy spreading.
 */
export function reduceAccordionContext(
  ctx: AccordionContext,
  event: AccordionEventType,
  payload?: { itemId?: string },
): Partial<AccordionContext> {
  const open = new Set(ctx.openItemIds);

  switch (event) {
    case 'TOGGLE_ITEM': {
      const id = payload?.itemId;
      if (!id) return {};
      if (open.has(id)) {
        // Prevent closing the last item when collapsible=false
        if (!ctx.collapsible && open.size === 1) return {};
        open.delete(id);
      } else {
        if (!ctx.multiple) open.clear(); // exclusive mode
        open.add(id);
      }
      return { openItemIds: open };
    }

    case 'OPEN_ITEM': {
      const id = payload?.itemId;
      if (!id) return {};
      if (!ctx.multiple) {
        const next = new Set<string>();
        next.add(id);
        return { openItemIds: next };
      }
      open.add(id);
      return { openItemIds: open };
    }

    case 'CLOSE_ITEM': {
      const id = payload?.itemId;
      if (!id) return {};
      if (!ctx.collapsible && open.size === 1 && open.has(id)) return {};
      open.delete(id);
      return { openItemIds: open };
    }

    case 'OPEN_ALL': {
      if (!ctx.multiple) return {}; // no-op for exclusive mode
      return { openItemIds: new Set(ctx.itemIds) };
    }

    case 'CLOSE_ALL': {
      if (!ctx.collapsible) return {}; // no-op: cannot close when not collapsible
      return { openItemIds: new Set() };
    }

    default:
      return {};
  }
}

/** Returns whether a specific item is currently open. */
export function isAccordionItemOpen(ctx: AccordionContext, itemId: string): boolean {
  return ctx.openItemIds.has(itemId);
}

/** Returns ARIA attributes for an accordion trigger button. */
export function getAccordionTriggerAriaProps(
  ctx: AccordionContext,
  itemId: string,
  panelId: string,
): Record<string, string | boolean> {
  const expanded = isAccordionItemOpen(ctx, itemId);
  return {
    role: 'button',
    'aria-expanded': expanded,
    'aria-controls': panelId,
  };
}

/** Returns ARIA attributes for an accordion panel. */
export function getAccordionPanelAriaProps(
  ctx: AccordionContext,
  panelId: string,
  triggerId: string,
): Record<string, string | boolean> {
  return {
    role: 'region',
    id: panelId,
    'aria-labelledby': triggerId,
    hidden: !isAccordionItemOpen(ctx, triggerId.replace('-trigger', '')),
  };
}
