/**
 * Dialog state machine types.
 * Drives all dialog/modal variants: Dialog, AlertDialog, Drawer, Sheet.
 */

export type DialogState = 'closed' | 'opening' | 'open' | 'closing';

export type DialogEventType =
  | 'OPEN'
  | 'CLOSE'
  | 'TOGGLE'
  | 'ANIMATION_END';

export interface DialogEvent {
  type: DialogEventType;
}

export interface DialogContext {
  /** Unique id used to wire aria-labelledby / aria-describedby */
  id: string;
  /** If true, focus is trapped and background is inert (modal dialog). */
  modal: boolean;
  /** Close on backdrop/overlay click. */
  closeOnOverlayClick: boolean;
  /** Close when Escape key is pressed. */
  closeOnEscape: boolean;
  /**
   * Whether to use CSS animation transitions (opening/closing states).
   * Set to false to skip the intermediate states.
   */
  animated: boolean;
}
