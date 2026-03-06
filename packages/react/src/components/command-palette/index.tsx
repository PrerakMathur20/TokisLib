import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { cn } from '../../utils/cn.js';
import { Portal } from '../portal/index.js';
import { trapFocus } from '/core';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  category?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  className?: string;
}

export function CommandPalette({
  open,
  onClose,
  items,
  placeholder = 'Search commands…',
  className,
}: CommandPaletteProps): JSX.Element | null {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q),
    );
  }, [query, items]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const cat = item.category ?? '';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(item);
    }
    return map;
  }, [filtered]);

  const flatFiltered = filtered;

  const handleSelect = useCallback(
    (item: CommandItem) => {
      item.onSelect();
      onClose();
      setQuery('');
      setActiveIndex(0);
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) { setQuery(''); setActiveIndex(0); return; }
    const cleanup = containerRef.current ? trapFocus(containerRef.current) : undefined;
    inputRef.current?.focus();
    return () => cleanup?.();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        const item = flatFiltered[activeIndex];
        if (item) handleSelect(item);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, flatFiltered, activeIndex, handleSelect, onClose]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  if (!open) return null;

  let globalIndex = 0;

  return (
    <Portal>
      <div
        className="tokis-command-palette-backdrop"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={containerRef}
        className={cn('tokis-command-palette', className)}
        role="dialog"
        aria-label="Command palette"
        aria-modal="true"
      >
        <div className="tokis-command-palette__search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="tokis-command-palette__search-icon">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="tokis-command-palette__input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={placeholder}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="tokis-command-palette__list" role="listbox">
          {filtered.length === 0 ? (
            <div className="tokis-command-palette__empty">No commands found</div>
          ) : (
            Array.from(grouped.entries()).map(([category, categoryItems]) => (
              <div key={category} className="tokis-command-palette__group">
                {category && (
                  <div className="tokis-command-palette__group-label">{category}</div>
                )}
                {categoryItems.map((item) => {
                  const idx = globalIndex++;
                  const isActive = activeIndex === idx;
                  return (
                    <button
                      key={item.id}
                      role="option"
                      aria-selected={isActive}
                      className={cn('tokis-command-palette__item', isActive && 'tokis-command-palette__item--active')}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(idx)}
                    >
                      {item.icon && (
                        <span className="tokis-command-palette__item-icon" aria-hidden="true">{item.icon}</span>
                      )}
                      <span className="tokis-command-palette__item-content">
                        <span className="tokis-command-palette__item-label">{item.label}</span>
                        {item.description && (
                          <span className="tokis-command-palette__item-desc">{item.description}</span>
                        )}
                      </span>
                      {item.shortcut && (
                        <span className="tokis-command-palette__shortcut" aria-label={`Shortcut: ${item.shortcut.join('+')}`}>
                          {item.shortcut.map((k, ki) => (
                            <kbd key={ki} className="tokis-command-palette__kbd">{k}</kbd>
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </Portal>
  );
}

CommandPalette.displayName = 'CommandPalette';
