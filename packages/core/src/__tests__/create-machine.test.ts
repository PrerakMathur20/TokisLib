import { describe, it, expect } from 'vitest';
import { createMachine, assign, setup } from '../state/create-machine.js';

// ─── Fixtures ──────────────────────────────────────────────────────────────

type TrafficState = 'red' | 'yellow' | 'green';
type TrafficEvent = 'NEXT';
interface TrafficCtx { cycles: number }

const trafficMachine = createMachine<TrafficState, TrafficEvent, TrafficCtx>({
  id: 'traffic',
  initial: 'red',
  context: { cycles: 0 },
  states: {
    red:    { NEXT: 'green' },
    green:  { NEXT: 'yellow' },
    yellow: { NEXT: 'red' },
  },
});

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('createMachine', () => {
  it('exposes the machine id and initial state from config', () => {
    expect(trafficMachine.id).toBe('traffic');
    expect(trafficMachine.initialState).toBe('red');
  });

  it('exposes the initial context', () => {
    expect(trafficMachine.initialContext).toEqual({ cycles: 0 });
  });

  it('transitions red → green on NEXT', () => {
    expect(trafficMachine.transition('red', 'NEXT')).toBe('green');
  });

  it('transitions green → yellow on NEXT', () => {
    expect(trafficMachine.transition('green', 'NEXT')).toBe('yellow');
  });

  it('transitions yellow → red on NEXT (cycle completes)', () => {
    expect(trafficMachine.transition('yellow', 'NEXT')).toBe('red');
  });

  it('returns the current state when no transition is defined', () => {
    // Create a machine with a terminal state that has no outgoing transitions
    const simple = createMachine<'on' | 'off', 'TOGGLE', object>({
      id: 'simple',
      initial: 'off',
      context: {},
      states: {
        off:  { TOGGLE: 'on' },
        on:   { TOGGLE: 'off' },
      },
    });
    // Sending an undefined event should return current state unchanged
    // @ts-expect-error — intentional invalid event for test
    expect(simple.transition('on', 'UNKNOWN')).toBe('on');
  });

  it('initial context is not mutated by multiple transitions', () => {
    trafficMachine.transition('red', 'NEXT');
    trafficMachine.transition('green', 'NEXT');
    // initialContext must be unchanged
    expect(trafficMachine.initialContext).toEqual({ cycles: 0 });
  });
});

describe('assign helper', () => {
  it('passes through a partial context object unchanged', () => {
    const patch = { cycles: 5 };
    expect(assign<TrafficCtx>(patch)).toBe(patch);
  });

  it('passes through an updater function unchanged', () => {
    const fn = (ctx: TrafficCtx) => ({ cycles: ctx.cycles + 1 });
    expect(assign<TrafficCtx>(fn)).toBe(fn);
  });
});

describe('setup helper', () => {
  it('returns a createMachine function', () => {
    const s = setup({});
    expect(typeof s.createMachine).toBe('function');
  });

  it('createMachine returned from setup produces a valid machine', () => {
    const s = setup({});
    const m = s.createMachine<'a' | 'b', 'GO', object>({
      id: 'test-setup',
      initial: 'a',
      context: {},
      states: { a: { GO: 'b' }, b: {} },
    });
    expect(m.transition('a', 'GO')).toBe('b');
  });
});
