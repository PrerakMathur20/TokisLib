export interface ButtonContext {
  disabled: boolean;
}

export type ButtonEvent =
  | { type: 'PRESS' }
  | { type: 'RELEASE' };
