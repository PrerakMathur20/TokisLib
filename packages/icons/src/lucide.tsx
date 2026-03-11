/**
 * @tokis/icons/lucide — Native Lucide React adapter.
 *
 * This module bridges the `lucide-react` icon library into the Tokis icon API.
 * It is a **separate entry point** so that projects that don't use Lucide
 * don't pay the peer-dep resolution cost.
 *
 * Usage:
 * ```tsx
 * // 1. Wrap a single Lucide icon to match the TokisIconProps API:
 * import { createTokisIcon } from '@tokis/icons/lucide';
 * import { Rocket } from 'lucide-react';
 * const RocketIcon = createTokisIcon(Rocket);
 * <RocketIcon size={20} aria-label="Launch" />
 *
 * // 2. Render any Lucide icon inline (useful in dynamic contexts):
 * import { LucideIcon } from '@tokis/icons/lucide';
 * import { Rocket } from 'lucide-react';
 * <LucideIcon icon={Rocket} size={20} />
 *
 * // 3. Re-export every Lucide icon already shaped like Tokis icons:
 * import { allLucideIcons, LucideChevronDown } from '@tokis/icons/lucide';
 * ```
 */

import { forwardRef } from 'react';
import type { ComponentType, SVGProps } from 'react';
import type { TokisIconProps } from './types.js';

// ─── Lucide's own prop shape ──────────────────────────────────────────────────

/**
 * Minimal interface that every `lucide-react` icon component satisfies.
 * We keep this local so that `lucide-react` is truly an optional peer dep
 * at runtime — it is only resolved when this sub-path is imported.
 */
interface LucideProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number;
  color?: string;
  absoluteStrokeWidth?: boolean;
}

type LucideIconComponent = ComponentType<LucideProps>;

// ─── createTokisIcon ──────────────────────────────────────────────────────────

/**
 * Wraps a `lucide-react` icon component so it conforms to `TokisIconProps`.
 *
 * ```tsx
 * import { createTokisIcon } from '@tokis/icons/lucide';
 * import { Rocket } from 'lucide-react';
 *
 * export const RocketIcon = createTokisIcon(Rocket, 'RocketIcon');
 * ```
 */
export function createTokisIcon(
  LucideComponent: LucideIconComponent,
  displayName?: string,
) {
  const Icon = forwardRef<SVGSVGElement, TokisIconProps>(function Icon(
    {
      size = 24,
      color = 'currentColor',
      strokeWidth = 2,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
      ...rest
    },
    _ref,
  ) {
    const isDecorative = !ariaLabel;
    return (
      <LucideComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden ?? (isDecorative ? true : undefined)}
        role={ariaLabel ? 'img' : undefined}
        {...rest}
      />
    );
  });

  Icon.displayName = displayName ?? LucideComponent.displayName ?? 'TokisLucideIcon';
  return Icon;
}

// ─── LucideIcon (render-prop / inline usage) ──────────────────────────────────

export interface LucideIconProps extends TokisIconProps {
  /** The Lucide icon component to render. */
  icon: LucideIconComponent;
}

/**
 * Renders any Lucide icon with Tokis prop conventions.
 * Useful when the icon is dynamic (stored in data or chosen at runtime).
 *
 * ```tsx
 * <LucideIcon icon={Rocket} size={20} aria-label="Launch" />
 * ```
 */
export const LucideIcon = forwardRef<SVGSVGElement, LucideIconProps>(
  function LucideIcon(
    {
      icon: IconComponent,
      size = 24,
      color = 'currentColor',
      strokeWidth = 2,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
      ...rest
    },
    _ref,
  ) {
    const isDecorative = !ariaLabel;
    return (
      <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden ?? (isDecorative ? true : undefined)}
        role={ariaLabel ? 'img' : undefined}
        {...rest}
      />
    );
  },
);

LucideIcon.displayName = 'LucideIcon';

// ─── useLucideIcon hook ───────────────────────────────────────────────────────

/**
 * Returns merged Tokis + Lucide default props.
 * Use this when building your own icon wrappers that mix Lucide with Tokis.
 */
export function useLucideIconProps(props: TokisIconProps): LucideProps {
  const {
    size = 24,
    color = 'currentColor',
    strokeWidth = 2,
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden,
    ...rest
  } = props;

  const isDecorative = !ariaLabel;

  return {
    size,
    color,
    strokeWidth,
    'aria-label': ariaLabel,
    'aria-hidden': (ariaHidden ?? (isDecorative ? true : undefined)) as boolean | undefined,
    role: ariaLabel ? 'img' : undefined,
    ...rest,
  };
}
