import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '../../utils/cn.js';

export interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  getItemKey?: (item: T, index: number) => string | number;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  height,
  renderItem,
  overscan = 3,
  className,
  getItemKey,
}: VirtualizedListProps<T>): JSX.Element {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(height / itemHeight);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);

  const paddingTop = startIndex * itemHeight;

  const handleScroll = useCallback(() => {
    if (containerRef.current) setScrollTop(containerRef.current.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('tokis-virtual-list', className)}
      style={{ height, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ position: 'absolute', top: paddingTop, left: 0, right: 0 }}>
          {items.slice(startIndex, endIndex + 1).map((item, offset) => {
            const index = startIndex + offset;
            const key = getItemKey ? getItemKey(item, index) : index;
            return (
              <div key={key} style={{ height: itemHeight }}>
                {renderItem(item, index)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

VirtualizedList.displayName = 'VirtualizedList';
