import { setup } from 'xstate';
import type { ButtonContext, ButtonEvent } from './button.types.js';

export const buttonMachine = setup({
  types: {
    context: {} as ButtonContext,
    events: {} as ButtonEvent,
  },
}).createMachine({
  id: 'button',
  initial: 'idle',
  context: {
    disabled: false,
  },
  states: {
    idle: {
      on: {
        PRESS: 'pressed',
      },
    },
    pressed: {
      on: {
        RELEASE: 'idle',
      },
    },
  },
});
