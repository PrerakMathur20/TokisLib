import { createMachine } from '../../state/create-machine.js';
import type { PopoverContext, PopoverState, PopoverEventType } from './popover.types.js';

/**
 * Popover state machine.
 *
 * Mirrors the Dialog machine's animated open/close cycle but without
 * modal focus trapping — the popover is non-modal by default.
 *
 * Transition table:
 *   closed  + OPEN          → opening  (animated) | open  (instant)
 *   opening + ANIMATION_END → open
 *   opening + CLOSE         → closed   (cancel open)
 *   open    + CLOSE         → closing  (animated) | closed (instant)
 *   open    + TOGGLE        → closing  (animated) | closed (instant)
 *   closing + ANIMATION_END → closed
 *   closing + OPEN          → opening  (re-open mid-close)
 *   closing + TOGGLE        → opening  (re-open mid-close)
 *   closed  + TOGGLE        → opening  (animated) | open  (instant)
 */
export const popoverMachine = createMachine<PopoverState, PopoverEventType, PopoverContext>({
  id: 'popover',
  initial: 'closed',
  context: {
    id: 'popover',
    triggerId: 'popover-trigger',
    placement: 'bottom',
    closeOnClickOutside: true,
    closeOnEscape: true,
    animated: true,
  },
  states: {
    closed: {
      OPEN:   'opening',
      TOGGLE: 'opening',
    },
    opening: {
      ANIMATION_END: 'open',
      CLOSE:         'closed',
    },
    open: {
      CLOSE:  'closing',
      TOGGLE: 'closing',
    },
    closing: {
      ANIMATION_END: 'closed',
      OPEN:          'opening',
      TOGGLE:        'opening',
    },
  },
});

// ─── Derived state helpers ─────────────────────────────────────────────────

/** Whether the popover DOM node should be present (mounted). */
export function isPopoverMounted(state: PopoverState): boolean {
  return state === 'open' || state === 'opening' || state === 'closing';
}

/** Whether the popover is visible (aria-expanded). */
export function isPopoverOpen(state: PopoverState): boolean {
  return state === 'open' || state === 'opening';
}

/** `data-state` attribute value for CSS animation hooks. */
export function getPopoverDataState(state: PopoverState): 'open' | 'closed' {
  return isPopoverOpen(state) ? 'open' : 'closed';
}

/** ARIA attributes for the trigger element. */
export function getPopoverTriggerAriaProps(
  state: PopoverState,
  ctx: PopoverContext,
): Record<string, string | boolean> {
  return {
    id: ctx.triggerId,
    'aria-expanded': isPopoverOpen(state),
    'aria-controls': ctx.id,
    'aria-haspopup': 'dialog',
  };
}

/** ARIA attributes for the popover container element. */
export function getPopoverAriaProps(
  ctx: PopoverContext,
): Record<string, string> {
  return {
    id: ctx.id,
    role: 'dialog',
    'aria-labelledby': ctx.triggerId,
  };
}
