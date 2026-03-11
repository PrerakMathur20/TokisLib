/**
 * Accordion state machine types.
 * Implements the WAI-ARIA Accordion pattern (role="button" triggers on headings).
 */

export type AccordionState = 'idle';

export type AccordionEventType =
  | 'TOGGLE_ITEM'   // toggle a single item open/closed
  | 'OPEN_ITEM'     // force-open a single item
  | 'CLOSE_ITEM'    // force-close a single item
  | 'OPEN_ALL'      // open all items (only meaningful when multiple=true)
  | 'CLOSE_ALL';    // close all items

export interface AccordionEvent {
  type: AccordionEventType;
  /** Item id for TOGGLE_ITEM / OPEN_ITEM / CLOSE_ITEM */
  itemId?: string;
}

export interface AccordionContext {
  /** Ordered list of all accordion item ids */
  itemIds: string[];
  /** Set of currently open item ids */
  openItemIds: Set<string>;
  /**
   * When false only one panel may be open at a time (exclusive accordion).
   * When true multiple panels may be open simultaneously.
   */
  multiple: boolean;
  /**
   * When true the last open panel cannot be closed (always one open).
   * Only meaningful when multiple=false.
   */
  collapsible: boolean;
}
