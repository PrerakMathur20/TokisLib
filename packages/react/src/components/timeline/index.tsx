import React from 'react';
import { cn } from '../../utils/cn.js';

export type TimelineVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface TimelineItem {
  id: string;
  title: string;
  description?: React.ReactNode;
  date?: string;
  icon?: React.ReactNode;
  variant?: TimelineVariant;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps): JSX.Element {
  return (
    <ol className={cn('tokis-timeline', className)} aria-label="Timeline">
      {items.map((item, index) => {
        const variant = item.variant ?? 'default';
        const isLast = index === items.length - 1;

        return (
          <li key={item.id} className="tokis-timeline__item">
            <div className="tokis-timeline__track" aria-hidden="true">
              <div className={cn('tokis-timeline__dot', `tokis-timeline__dot--${variant}`)}>
                {item.icon ?? null}
              </div>
              {!isLast && <div className="tokis-timeline__connector" />}
            </div>
            <div className="tokis-timeline__content">
              <div className="tokis-timeline__header">
                <span className="tokis-timeline__title">{item.title}</span>
                {item.date && (
                  <time className="tokis-timeline__date" dateTime={item.date}>
                    {item.date}
                  </time>
                )}
              </div>
              {item.description && (
                <div className="tokis-timeline__desc">{item.description}</div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
