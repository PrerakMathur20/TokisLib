import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonRoot } from '../components/button/ButtonRoot.js';

// ─── Rendering ─────────────────────────────────────────────────────────────

describe('ButtonRoot rendering', () => {
  it('renders a <button> element by default', () => {
    render(<ButtonRoot>Click me</ButtonRoot>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<ButtonRoot>Save Changes</ButtonRoot>);
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('applies the primary variant class by default', () => {
    render(<ButtonRoot>Button</ButtonRoot>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('tokis-btn--primary');
  });

  it('applies the correct variant class for each variant', () => {
    const variants = ['primary', 'secondary', 'ghost', 'outline', 'destructive', 'link'] as const;
    for (const variant of variants) {
      const { unmount } = render(<ButtonRoot variant={variant}>Btn</ButtonRoot>);
      expect(screen.getByRole('button')).toHaveClass(`tokis-btn--${variant}`);
      unmount();
    }
  });

  it('applies size class for non-default sizes', () => {
    render(<ButtonRoot size="sm">Sm</ButtonRoot>);
    expect(screen.getByRole('button')).toHaveClass('tokis-btn--sm');
  });

  it('does NOT apply a size class for the default md size', () => {
    render(<ButtonRoot size="md">Md</ButtonRoot>);
    expect(screen.getByRole('button')).not.toHaveClass('tokis-btn--md');
  });

  it('applies tokis-btn--full when fullWidth=true', () => {
    render(<ButtonRoot fullWidth>Full</ButtonRoot>);
    expect(screen.getByRole('button')).toHaveClass('tokis-btn--full');
  });

  it('applies tokis-btn--icon-only when iconOnly=true', () => {
    render(<ButtonRoot iconOnly aria-label="Icon">×</ButtonRoot>);
    expect(screen.getByRole('button')).toHaveClass('tokis-btn--icon-only');
  });

  it('renders a spinner and applies loading class when loading=true', () => {
    render(<ButtonRoot loading>Loading</ButtonRoot>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('tokis-btn--loading');
    expect(btn.querySelector('.tokis-spinner')).toBeInTheDocument();
  });

  it('forwards additional className', () => {
    render(<ButtonRoot className="my-custom-class">Btn</ButtonRoot>);
    expect(screen.getByRole('button')).toHaveClass('my-custom-class');
  });

  it('passes through arbitrary HTML attributes (e.g., data-testid)', () => {
    render(<ButtonRoot data-testid="save-btn">Save</ButtonRoot>);
    expect(screen.getByTestId('save-btn')).toBeInTheDocument();
  });
});

// ─── Disabled state ────────────────────────────────────────────────────────

describe('ButtonRoot disabled', () => {
  it('sets the native disabled attribute when disabled=true', () => {
    render(<ButtonRoot disabled>Disabled</ButtonRoot>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('sets the native disabled attribute when loading=true (prevents interaction)', () => {
    render(<ButtonRoot loading>Loading</ButtonRoot>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('sets aria-busy when loading=true', () => {
    render(<ButtonRoot loading>Loading</ButtonRoot>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
});

// ─── Click behaviour ───────────────────────────────────────────────────────

describe('ButtonRoot onClick', () => {
  it('calls onClick handler when clicked', () => {
    const onClick = vi.fn();
    render(<ButtonRoot onClick={onClick}>Go</ButtonRoot>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<ButtonRoot disabled onClick={onClick}>Go</ButtonRoot>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does NOT call onClick when loading', () => {
    const onClick = vi.fn();
    render(<ButtonRoot loading onClick={onClick}>Go</ButtonRoot>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});

// ─── Polymorphic rendering ─────────────────────────────────────────────────

describe('ButtonRoot as prop (polymorphic)', () => {
  it('renders as <a> when as="a"', () => {
    render(
      <ButtonRoot as="a" href="/home">
        Home
      </ButtonRoot>,
    );
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });
});
