import React, { useState, useRef, useId } from 'react';
import { cn } from '../../utils/cn.js';

export interface TabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  variant?: 'line' | 'pills';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Tabs({ tabs, defaultValue, value, onChange, variant = 'line', orientation = 'horizontal', className }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? tabs[0]?.value ?? '');
  const activeValue = value ?? internalValue;
  const tablistRef = useRef<HTMLDivElement>(null);
  const groupId = useId();

  const handleChange = (val: string) => {
    if (value === undefined) setInternalValue(val);
    onChange?.(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const idx = enabledTabs.findIndex((t) => t.value === tabs[currentIndex].value);
    let nextIdx = idx;
    const isVertical = orientation === 'vertical';

    if ((e.key === 'ArrowRight' && !isVertical) || (e.key === 'ArrowDown' && isVertical)) {
      nextIdx = (idx + 1) % enabledTabs.length;
    } else if ((e.key === 'ArrowLeft' && !isVertical) || (e.key === 'ArrowUp' && isVertical)) {
      nextIdx = (idx - 1 + enabledTabs.length) % enabledTabs.length;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = enabledTabs.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    handleChange(enabledTabs[nextIdx].value);
    const buttons = tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])');
    buttons?.[nextIdx]?.focus();
  };

  return (
    <div className={cn('tokis-tabs-root', orientation === 'vertical' && 'tokis-tabs-root--vertical', className)}>
      <div
        ref={tablistRef}
        role="tablist"
        aria-orientation={orientation}
        className={cn('tokis-tabs-list', variant === 'pills' && 'tokis-tabs-list--pills')}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.value}
            role="tab"
            id={`${groupId}-tab-${tab.value}`}
            aria-controls={`${groupId}-panel-${tab.value}`}
            aria-selected={tab.value === activeValue}
            aria-disabled={tab.disabled}
            disabled={tab.disabled}
            tabIndex={tab.value === activeValue ? 0 : -1}
            data-active={tab.value === activeValue ? 'true' : undefined}
            className="tokis-tabs-trigger"
            onClick={() => { if (!tab.disabled) handleChange(tab.value); }}
            onKeyDown={(e) => handleKeyDown(e, i)}
          >
            {tab.icon && <span className="tokis-btn__icon" aria-hidden="true">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.value}
          role="tabpanel"
          id={`${groupId}-panel-${tab.value}`}
          aria-labelledby={`${groupId}-tab-${tab.value}`}
          tabIndex={0}
          className="tokis-tabs-panel"
          hidden={tab.value !== activeValue}
        >
          {tab.value === activeValue ? tab.content : null}
        </div>
      ))}
    </div>
  );
}



