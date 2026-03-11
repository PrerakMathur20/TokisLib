/**
 * Popover state machine types.
 * Implements the WAI-ARIA Disclosure / Popover pattern.
 * Also used by Tooltip, ColorPicker, and floating panel variants.
 */

export type PopoverState =
  | 'closed'
  | 'opening'   // CSS enter animation in flight
  | 'open'
  | 'closing';  // CSS leave animation in flight

export type PopoverEventType =
  | 'OPEN'
  | 'CLOSE'
  | 'TOGGLE'
  | 'ANIMATION_END';

export interface PopoverEvent {
  type: PopoverEventType;
}

/**
 * Placement follows the Floating UI / Popper.js convention:
 * "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" |
 * "left" | "left-start" | "left-end" | "right" | "right-start" | "right-end"
 */
export type PopoverPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

export interface PopoverContext {
  /** Unique id; popover element gets this id, trigger gets aria-controls=id */
  id: string;
  /** Id of the trigger element */
  triggerId: string;
  /** Desired placement relative to the trigger */
  placement: PopoverPlacement;
  /** Close when a click occurs outside the popover + trigger */
  closeOnClickOutside: boolean;
  /** Close when Escape key is pressed */
  closeOnEscape: boolean;
  /**
   * Whether the popover uses CSS enter/leave animations.
   * When false, opening/closing states are skipped.
   */
  animated: boolean;
}
