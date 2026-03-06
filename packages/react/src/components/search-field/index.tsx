import React, { useRef, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn.js';

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  debounce?: number;
  label?: string;
  className?: string;
}

export function SearchField({
  value,
  onChange,
  onSearch,
  placeholder = 'Search…',
  loading = false,
  debounce = 300,
  label,
  className,
}: SearchFieldProps): JSX.Element {
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      onChange(val);
      if (onSearch) {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => onSearch(val), debounce);
      }
    },
    [onChange, onSearch, debounce],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        clearTimeout(debounceRef.current);
        onSearch(value);
      }
      if (e.key === 'Escape') {
        onChange('');
        onSearch?.('');
      }
    },
    [value, onChange, onSearch],
  );

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return (
    <div className={cn('tokis-search-field', className)}>
      {label && <label className="tokis-search-field__label">{label}</label>}
      <div className="tokis-search-field__wrap">
        <span className="tokis-search-field__icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4" />
            <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="search"
          className="tokis-search-field__input"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={label ?? placeholder}
        />
        {loading && (
          <span className="tokis-search-field__spinner" aria-label="Searching…" />
        )}
        {!loading && value && (
          <button
            type="button"
            className="tokis-search-field__clear"
            onClick={() => { onChange(''); onSearch?.(''); }}
            aria-label="Clear search"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

SearchField.displayName = 'SearchField';
