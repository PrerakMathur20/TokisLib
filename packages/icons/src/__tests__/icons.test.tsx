import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createIcon } from '../icon-factory.js';
import {
  ChevronDownIcon,
  SearchIcon,
  XIcon,
  CheckIcon,
  LoaderIcon,
} from '../icons/index.js';

// ─── createIcon factory ────────────────────────────────────────────────────

describe('createIcon', () => {
  const TestIcon = createIcon('TestIcon', <path d="M1 1 L23 23" />);

  it('renders an SVG element', () => {
    const { container } = render(<TestIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('sets the displayName on the component', () => {
    expect(TestIcon.displayName).toBe('TestIcon');
  });

  it('uses default size of 24px', () => {
    const { container } = render(<TestIcon />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '24px');
    expect(svg).toHaveAttribute('height', '24px');
  });

  it('accepts a custom numeric size', () => {
    const { container } = render(<TestIcon size={32} />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '32px');
    expect(svg).toHaveAttribute('height', '32px');
  });

  it('accepts a string size (e.g. "1.5rem")', () => {
    const { container } = render(<TestIcon size="1.5rem" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '1.5rem');
    expect(svg).toHaveAttribute('height', '1.5rem');
  });

  it('renders on a 24×24 viewBox regardless of size prop', () => {
    const { container } = render(<TestIcon size={48} />);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('is aria-hidden by default (decorative)', () => {
    const { container } = render(<TestIcon />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('is NOT aria-hidden when aria-label is provided', () => {
    const { container } = render(<TestIcon aria-label="Test icon" />);
    const svg = container.querySelector('svg')!;
    expect(svg).not.toHaveAttribute('aria-hidden', 'true');
  });

  it('has role="img" when aria-label is provided', () => {
    const { container } = render(<TestIcon aria-label="Test icon" />);
    expect(container.querySelector('svg')).toHaveAttribute('role', 'img');
  });

  it('renders a <title> element with the aria-label text for AT accessibility', () => {
    const { container } = render(<TestIcon aria-label="Close dialog" />);
    const title = container.querySelector('svg title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Close dialog');
  });

  it('does NOT render a <title> element without aria-label', () => {
    const { container } = render(<TestIcon />);
    expect(container.querySelector('title')).not.toBeInTheDocument();
  });

  it('uses currentColor by default for stroke', () => {
    const { container } = render(<TestIcon />);
    expect(container.querySelector('svg')).toHaveAttribute('stroke', 'currentColor');
  });

  it('accepts a custom stroke color', () => {
    const { container } = render(<TestIcon color="#ff0000" />);
    expect(container.querySelector('svg')).toHaveAttribute('stroke', '#ff0000');
  });

  it('uses default strokeWidth=2', () => {
    const { container } = render(<TestIcon />);
    expect(container.querySelector('svg')).toHaveAttribute('stroke-width', '2');
  });

  it('accepts a custom strokeWidth', () => {
    const { container } = render(<TestIcon strokeWidth={1.5} />);
    expect(container.querySelector('svg')).toHaveAttribute('stroke-width', '1.5');
  });

  it('passes through extra SVG props (data-testid, className)', () => {
    const { container } = render(
      <TestIcon data-testid="my-icon" className="custom-icon" />,
    );
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('data-testid', 'my-icon');
    expect(svg).toHaveClass('custom-icon');
  });

  it('is focusable via ref forwarding', () => {
    const ref = { current: null as SVGSVGElement | null };
    const { container } = render(<TestIcon ref={ref} />);
    expect(ref.current).toBe(container.querySelector('svg'));
  });
});

// ─── Built-in icon smoke tests ─────────────────────────────────────────────

describe('built-in icons render without errors', () => {
  const iconMap = {
    ChevronDownIcon,
    SearchIcon,
    XIcon,
    CheckIcon,
    LoaderIcon,
  };

  Object.entries(iconMap).forEach(([name, Icon]) => {
    it(`${name} renders an SVG element`, () => {
      const { container } = render(<Icon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it(`${name} with aria-label is accessible`, () => {
      render(<Icon aria-label={`${name} icon`} />);
      expect(screen.getByRole('img', { name: `${name} icon` })).toBeInTheDocument();
    });
  });
});
