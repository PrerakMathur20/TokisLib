import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '../components/checkbox/index.js';

// ─── Rendering ─────────────────────────────────────────────────────────────

describe('Checkbox rendering', () => {
  it('renders an accessible checkbox input', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
  });

  it('renders with aria-label when no label prop is given', () => {
    render(<Checkbox aria-label="Toggle feature" />);
    expect(screen.getByRole('checkbox', { name: 'Toggle feature' })).toBeInTheDocument();
  });

  it('renders description text when provided', () => {
    render(<Checkbox label="Subscribe" description="Get weekly newsletter" />);
    expect(screen.getByText('Get weekly newsletter')).toBeInTheDocument();
  });

  it('associates description via aria-describedby', () => {
    render(<Checkbox label="Subscribe" description="Get weekly newsletter" />);
    const checkbox = screen.getByRole('checkbox');
    const descId = checkbox.getAttribute('aria-describedby');
    expect(descId).toBeTruthy();
    expect(document.getElementById(descId!)).toHaveTextContent('Get weekly newsletter');
  });

  it('forwards id to the input element', () => {
    render(<Checkbox label="Check" id="my-checkbox" />);
    expect(document.getElementById('my-checkbox')).toBeInTheDocument();
    expect(document.getElementById('my-checkbox')).toHaveAttribute('type', 'checkbox');
  });

  it('forwards name and value attributes', () => {
    render(<Checkbox label="Option A" name="options" value="a" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('name', 'options');
    expect(checkbox).toHaveAttribute('value', 'a');
  });
});

// ─── Checked state ─────────────────────────────────────────────────────────

describe('Checkbox checked state', () => {
  it('is unchecked by default', () => {
    render(<Checkbox label="Option" />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('reflects controlled checked=true', () => {
    render(<Checkbox label="Option" checked={true} onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('reflects controlled checked=false', () => {
    render(<Checkbox label="Option" checked={false} onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('starts checked when defaultChecked=true (uncontrolled)', () => {
    render(<Checkbox label="Option" defaultChecked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});

// ─── onChange callback ─────────────────────────────────────────────────────

describe('Checkbox onChange', () => {
  it('calls onChange(true) when unchecked checkbox is clicked', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Option" checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange(false) when checked checkbox is clicked', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Option" checked={true} onChange={onChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('does NOT call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Option" disabled onChange={onChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ─── Disabled state ────────────────────────────────────────────────────────

describe('Checkbox disabled', () => {
  it('renders as disabled when disabled=true', () => {
    render(<Checkbox label="Option" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('adds data-disabled to the root label', () => {
    render(<Checkbox label="Option" disabled />);
    const root = screen.getByRole('checkbox').closest('.tokis-checkbox-root');
    expect(root).toHaveAttribute('data-disabled');
  });
});
