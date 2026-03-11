import { createMachine } from '../../state/create-machine.js';
import type { DialogContext, DialogState, DialogEventType } from './dialog.types.js';

/**
 * Dialog state machine.
 *
 * Transition table:
 *
 *   closed  + OPEN          → opening  (animated) | open (no animation)
 *   opening + ANIMATION_END → open
 *   open    + CLOSE         → closing  (animated) | closed (no animation)
 *   open    + TOGGLE        → closing  (animated) | closed (no animation)
 *   closing + ANIMATION_END → closed
 *   closed  + TOGGLE        → opening  (animated) | open (no animation)
 *
 * When `animated` is false the intermediate opening/closing states are
 * skipped — callers simply never fire ANIMATION_END and can treat
 * open/closed as the only two live states.
 */
export const dialogMachine = createMachine<DialogState, DialogEventType, DialogContext>({
  id: 'dialog',
  initial: 'closed',
  context: {
    id: 'dialog',
    modal: true,
    closeOnOverlayClick: true,
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
      // Immediately cancel if closed before animation completes
      CLOSE: 'closed',
    },
    open: {
      CLOSE:  'closing',
      TOGGLE: 'closing',
    },
    closing: {
      ANIMATION_END: 'closed',
      // Re-open before close animation completes
      OPEN:   'opening',
      TOGGLE: 'opening',
    },
  },
});

/** Derive if the dialog DOM node should be mounted (present in the DOM) */
export function isDialogMounted(state: DialogState): boolean {
  return state === 'open' || state === 'opening' || state === 'closing';
}

/** Derive aria-expanded / open prop */
export function isDialogOpen(state: DialogState): boolean {
  return state === 'open' || state === 'opening';
}
