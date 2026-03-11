/**
 * Tabs state machine types.
 * Implements the WAI-ARIA Tabs pattern (role="tablist" / role="tab" / role="tabpanel").
 */

/**
 * The tabs machine itself has a single macro-state; per-tab active state is
 * captured in context rather than as discrete machine states so that the
 * number of states doesn't balloon with the number of tabs.
 */
export type TabsState = 'idle';

export type TabsEventType =
  | 'SELECT_TAB'    // programmatic or click — activates a tab immediately
  | 'FOCUS_TAB'     // keyboard focus only — in manual mode does NOT activate
  | 'NEXT_TAB'      // arrow right / arrow down
  | 'PREV_TAB'      // arrow left / arrow up
  | 'FIRST_TAB'     // Home key
  | 'LAST_TAB';     // End key

export interface TabsEvent {
  type: TabsEventType;
  /** Tab id for SELECT_TAB / FOCUS_TAB events */
  tabId?: string;
}

export interface TabsContext {
  /** Ordered list of tab ids */
  tabIds: string[];
  /** Currently active (selected) tab id */
  activeTabId: string;
  /** Keyboard-focused tab id (may differ from active in manual activation mode) */
  focusedTabId: string;
  /**
   * 'automatic' — arrow keys both focus AND activate.
   * 'manual'    — arrow keys only move focus; Enter/Space activates.
   */
  activationMode: 'automatic' | 'manual';
  /** Layout axis for arrow key handling */
  orientation: 'horizontal' | 'vertical';
  /** Loop from last tab to first (and vice versa) */
  loop: boolean;
}
