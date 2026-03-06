import React, { useState, useId } from 'react';
import { cn } from '../../utils/cn.js';

export interface AccordionItem {
  value: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  variant?: 'bordered' | 'flush';
  className?: string;
}

export function Accordion({ items, type = 'single', defaultValue, value, onChange, collapsible = true, variant = 'bordered', className }: AccordionProps) {
  const normalize = (v: string | string[] | undefined) => {
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  };

  const [internal, setInternal] = useState<string[]>(normalize(defaultValue));
  const controlled = value !== undefined;
  const openValues = controlled ? normalize(value) : internal;

  const toggle = (val: string) => {
    const isOpen = openValues.includes(val);
    let next: string[];
    if (type === 'single') {
      next = isOpen && collapsible ? [] : [val];
    } else {
      next = isOpen ? openValues.filter((v) => v !== val) : [...openValues, val];
    }
    if (!controlled) setInternal(next);
    onChange?.(type === 'single' ? (next[0] ?? '') : next);
  };

  return (
    <div className={cn('tokis-accordion-root', variant === 'flush' && 'tokis-accordion-root--flush', className)}>
      {items.map((item) => (
        <AccordionItemComponent key={item.value} item={item} isOpen={openValues.includes(item.value)} onToggle={toggle} />
      ))}
    </div>
  );
}

function AccordionItemComponent({ item, isOpen, onToggle }: { item: AccordionItem; isOpen: boolean; onToggle: (v: string) => void }) {
  const triggerId = useId();
  const panelId = useId();

  return (
    <div className="tokis-accordion-item">
      <button
        id={triggerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-disabled={item.disabled || undefined}
        disabled={item.disabled}
        className="tokis-accordion-trigger"
        onClick={() => { if (!item.disabled) onToggle(item.value); }}
      >
        <span style={{ flex: 1, textAlign: 'left' }}>{item.trigger}</span>
        <svg className="tokis-accordion-trigger__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {/* No hidden attribute — CSS grid-template-rows handles collapse/expand */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="tokis-accordion-content"
        data-open={isOpen ? 'true' : 'false'}
        aria-hidden={!isOpen}
      >
        <div className="tokis-accordion-content-inner">{item.content}</div>
      </div>
    </div>
  );
}

