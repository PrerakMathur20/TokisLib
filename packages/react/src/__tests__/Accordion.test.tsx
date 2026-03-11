import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion } from '../components/accordion/index.js';
import type { AccordionItem } from '../components/accordion/index.js';

// ─── Fixtures ──────────────────────────────────────────────────────────────

const items: AccordionItem[] = [
  { value: 'one',   trigger: 'Section One',   content: 'Content One'   },
  { value: 'two',   trigger: 'Section Two',   content: 'Content Two'   },
  { value: 'three', trigger: 'Section Three', content: 'Content Three', disabled: true },
];

// ─── Rendering ─────────────────────────────────────────────────────────────

describe('Accordion rendering', () => {
  it('renders all trigger buttons', () => {
    render(<Accordion items={items} />);
    expect(screen.getByRole('button', { name: /Section One/   })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Section Two/   })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Section Three/ })).toBeInTheDocument();
  });

  it('renders content panels with role="region"', () => {
    render(<Accordion items={items} />);
    // Panels are in the DOM but hidden from a11y tree when closed → use hidden:true
    const regions = screen.getAllByRole('region', { hidden: true });
    expect(regions).toHaveLength(3);
  });

  it('applies bordered variant class by default', () => {
    const { container } = render(<Accordion items={items} />);
    expect(container.firstChild).toHaveClass('tokis-accordion-root');
    expect(container.firstChild).not.toHaveClass('tokis-accordion-root--flush');
  });

  it('applies flush variant class when variant="flush"', () => {
    const { container } = render(<Accordion items={items} variant="flush" />);
    expect(container.firstChild).toHaveClass('tokis-accordion-root--flush');
  });

  it('forwards className to the root element', () => {
    const { container } = render(<Accordion items={items} className="my-accordion" />);
    expect(container.firstChild).toHaveClass('my-accordion');
  });
});

// ─── Uncontrolled open/close ───────────────────────────────────────────────

describe('Accordion uncontrolled interactions', () => {
  it('starts with all items closed by default', () => {
    render(<Accordion items={items} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      if (!btn.hasAttribute('disabled')) {
        expect(btn).toHaveAttribute('aria-expanded', 'false');
      }
    });
  });

  it('opens an item when its trigger is clicked', () => {
    render(<Accordion items={items} />);
    const trigger = screen.getByRole('button', { name: /Section One/ });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes an open item when clicked again (collapsible=true)', () => {
    render(<Accordion items={items} />);
    const trigger = screen.getByRole('button', { name: /Section One/ });
    fireEvent.click(trigger); // open
    fireEvent.click(trigger); // close
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('single mode: opening one item closes the previously open item', () => {
    render(<Accordion items={items} type="single" />);
    const trigger1 = screen.getByRole('button', { name: /Section One/ });
    const trigger2 = screen.getByRole('button', { name: /Section Two/ });

    fireEvent.click(trigger1);
    expect(trigger1).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(trigger2);
    expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    expect(trigger1).toHaveAttribute('aria-expanded', 'false');
  });

  it('multiple mode: multiple items can be open simultaneously', () => {
    render(<Accordion items={items} type="multiple" />);
    const trigger1 = screen.getByRole('button', { name: /Section One/ });
    const trigger2 = screen.getByRole('button', { name: /Section Two/ });

    fireEvent.click(trigger1);
    fireEvent.click(trigger2);
    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(trigger2).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens to defaultValue on mount', () => {
    render(<Accordion items={items} defaultValue="two" />);
    const trigger2 = screen.getByRole('button', { name: /Section Two/ });
    expect(trigger2).toHaveAttribute('aria-expanded', 'true');
  });
});

// ─── Controlled mode ───────────────────────────────────────────────────────

describe('Accordion controlled', () => {
  it('reflects the controlled value', () => {
    render(<Accordion items={items} value="one" onChange={vi.fn()} />);
    const trigger1 = screen.getByRole('button', { name: /Section One/ });
    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls onChange with the new value when a trigger is clicked', () => {
    const onChange = vi.fn();
    render(<Accordion items={items} value="" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Section One/ }));
    expect(onChange).toHaveBeenCalledWith('one');
  });

  it('does not change state when controlled (parent manages state)', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Accordion items={items} value="one" onChange={onChange} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Section Two/ }));
    // State should still be 'one' since we didn't update the prop
    const trigger1 = screen.getByRole('button', { name: /Section One/ });
    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    rerender(<Accordion items={items} value="two" onChange={onChange} />);
    expect(screen.getByRole('button', { name: /Section Two/ })).toHaveAttribute('aria-expanded', 'true');
  });
});

// ─── Disabled items ────────────────────────────────────────────────────────

describe('Accordion disabled items', () => {
  it('renders disabled triggers as disabled', () => {
    render(<Accordion items={items} />);
    const trigger3 = screen.getByRole('button', { name: /Section Three/ });
    expect(trigger3).toBeDisabled();
  });

  it('does not open a disabled item when clicked', () => {
    render(<Accordion items={items} />);
    const trigger3 = screen.getByRole('button', { name: /Section Three/ });
    fireEvent.click(trigger3);
    expect(trigger3).toHaveAttribute('aria-expanded', 'false');
  });
});

// ─── ARIA relationships ────────────────────────────────────────────────────

describe('Accordion ARIA wiring', () => {
  it('trigger aria-controls points to the panel id', () => {
    render(<Accordion items={items.slice(0, 1)} />);
    const trigger = screen.getByRole('button', { name: /Section One/ });
    const panelId = trigger.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    const panel = document.getElementById(panelId!);
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute('role', 'region');
  });

  it('panel aria-labelledby points back to the trigger id', () => {
    render(<Accordion items={items.slice(0, 1)} />);
    const trigger = screen.getByRole('button', { name: /Section One/ });
    const panel = screen.getByRole('region', { hidden: true });
    expect(panel).toHaveAttribute('aria-labelledby', trigger.id);
  });
});
