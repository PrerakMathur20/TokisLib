import { describe, it, expect } from 'vitest';
import { dialogMachine, isDialogMounted, isDialogOpen } from '../primitives/dialog/dialog.machine.js';
import type { DialogState } from '../primitives/dialog/dialog.types.js';

// ─── Transition tests ──────────────────────────────────────────────────────

describe('dialogMachine transitions', () => {
  const t = (state: DialogState, event: Parameters<typeof dialogMachine.transition>[1]) =>
    dialogMachine.transition(state, event);

  it('starts in the closed state', () => {
    expect(dialogMachine.initialState).toBe('closed');
  });

  it('closed + OPEN → opening', () => {
    expect(t('closed', 'OPEN')).toBe('opening');
  });

  it('closed + TOGGLE → opening', () => {
    expect(t('closed', 'TOGGLE')).toBe('opening');
  });

  it('opening + ANIMATION_END → open', () => {
    expect(t('opening', 'ANIMATION_END')).toBe('open');
  });

  it('opening + CLOSE → closed (cancel before animation finishes)', () => {
    expect(t('opening', 'CLOSE')).toBe('closed');
  });

  it('open + CLOSE → closing', () => {
    expect(t('open', 'CLOSE')).toBe('closing');
  });

  it('open + TOGGLE → closing', () => {
    expect(t('open', 'TOGGLE')).toBe('closing');
  });

  it('closing + ANIMATION_END → closed', () => {
    expect(t('closing', 'ANIMATION_END')).toBe('closed');
  });

  it('closing + OPEN → opening (re-open during close animation)', () => {
    expect(t('closing', 'OPEN')).toBe('opening');
  });

  it('closing + TOGGLE → opening', () => {
    expect(t('closing', 'TOGGLE')).toBe('opening');
  });

  it('full open→close cycle via ANIMATION_END', () => {
    let state: DialogState = dialogMachine.initialState;
    state = dialogMachine.transition(state, 'OPEN');          // → opening
    state = dialogMachine.transition(state, 'ANIMATION_END'); // → open
    state = dialogMachine.transition(state, 'CLOSE');         // → closing
    state = dialogMachine.transition(state, 'ANIMATION_END'); // → closed
    expect(state).toBe('closed');
  });
});

// ─── Derived boolean helpers ───────────────────────────────────────────────

describe('isDialogMounted', () => {
  it('returns false when closed', () => {
    expect(isDialogMounted('closed')).toBe(false);
  });

  it('returns true when opening (animation in progress)', () => {
    expect(isDialogMounted('opening')).toBe(true);
  });

  it('returns true when open', () => {
    expect(isDialogMounted('open')).toBe(true);
  });

  it('returns true when closing (DOM still present until animation ends)', () => {
    expect(isDialogMounted('closing')).toBe(true);
  });
});

describe('isDialogOpen', () => {
  it('returns false when closed', () => {
    expect(isDialogOpen('closed')).toBe(false);
  });

  it('returns true when opening', () => {
    expect(isDialogOpen('opening')).toBe(true);
  });

  it('returns true when open', () => {
    expect(isDialogOpen('open')).toBe(true);
  });

  it('returns false when closing', () => {
    expect(isDialogOpen('closing')).toBe(false);
  });
});
