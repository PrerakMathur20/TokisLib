import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '../components/select/index.js';
import type { SelectOption } from '../components/select/index.js';

// ─── Fixtures ──────────────────────────────────────────────────────────────

const options: SelectOption[] = [
  { value: 'apple',  label: 'Apple'  },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', disabled: true },
  { value: 'date',   label: 'Date'   },
];

// ─── Rendering ─────────────────────────────────────────────────────────────

describe('Select rendering', () => {
  it('renders a combobox trigger button', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows placeholder text when no value is selected', () => {
    render(<Select options={options} placeholder="Pick a fruit" />);
    expect(screen.getByText('Pick a fruit')).toBeInTheDocument();
  });

  it('renders the label when provided', () => {
    render(<Select options={options} label="Favourite Fruit" />);
    expect(screen.getByText('Favourite Fruit')).toBeInTheDocument();
  });

  it('renders helper text when provided', () => {
    render(<Select options={options} helperText="Select one option" />);
    expect(screen.getByText('Select one option')).toBeInTheDocument();
  });

  it('shows selected option label for a controlled value', () => {
    render(<Select options={options} value="banana" onChange={vi.fn()} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
  });
});

// ─── Dropdown open/close ───────────────────────────────────────────────────

describe('Select dropdown open/close', () => {
  it('opens the dropdown when the trigger is clicked', () => {
    render(<Select options={options} />);
    fireEvent.click(screen.getByRole('combobox'));
    // All enabled options should be visible in the listbox
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
  });

  it('closes the dropdown after selecting an option', () => {
    render(<Select options={options} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: 'Apple' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes on Escape key', () => {
    render(<Select options={options} />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('sets aria-expanded=true when open', () => {
    render(<Select options={options} />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});

// ─── Selection ─────────────────────────────────────────────────────────────

describe('Select selection', () => {
  it('calls onChange with the selected value', () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: 'Banana' }));
    expect(onChange).toHaveBeenCalledWith('banana');
  });

  it('updates displayed value in uncontrolled mode after selection', () => {
    render(<Select options={options} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: 'Date' }));
    expect(screen.getByRole('combobox')).toHaveTextContent('Date');
  });

  it('shows selected state via defaultValue on mount', () => {
    render(<Select options={options} defaultValue="banana" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
  });

  it('does not call onChange for disabled options', () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    fireEvent.click(screen.getByRole('combobox'));
    const cherryOption = screen.getByRole('option', { name: 'Cherry' });
    fireEvent.click(cherryOption);
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ─── Disabled state ────────────────────────────────────────────────────────

describe('Select disabled', () => {
  it('renders the trigger as disabled when disabled=true', () => {
    render(<Select options={options} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('does not open the dropdown when disabled', () => {
    render(<Select options={options} disabled />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

// ─── Keyboard navigation ───────────────────────────────────────────────────

describe('Select keyboard navigation', () => {
  it('opens the dropdown on ArrowDown', () => {
    render(<Select options={options} />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('opens the dropdown on Enter', () => {
    render(<Select options={options} />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
});
