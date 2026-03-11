/**
 * Menu / DropdownMenu state machine types.
 * Implements the WAI-ARIA Menu Button pattern.
 */

export type MenuState =
  | 'closed'
  | 'open';

export type MenuEventType =
  | 'OPEN'          // open the menu
  | 'CLOSE'         // close the menu
  | 'TOGGLE'        // toggle open/closed
  | 'FOCUS_ITEM'    // focus a specific item by id
  | 'NEXT_ITEM'     // arrow down
  | 'PREV_ITEM'     // arrow up
  | 'FIRST_ITEM'    // Home key
  | 'LAST_ITEM'     // End key
  | 'SELECT_ITEM'   // Enter / click on focused item
  | 'SEARCH';       // typeahead character search

export interface MenuEvent {
  type: MenuEventType;
  itemId?: string;
  /** For SEARCH: the character typed */
  char?: string;
}

export interface MenuItemDescriptor {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface MenuContext {
  /** Trigger element id (for aria-labelledby on the menu) */
  triggerId: string;
  /** All menu item descriptors in display order */
  items: MenuItemDescriptor[];
  /** Id of the currently focused item (-1 when none) */
  activeItemId: string | null;
  /** Accumulated typeahead search string */
  searchBuffer: string;
  /** Loop from last item back to first */
  loop: boolean;
}
