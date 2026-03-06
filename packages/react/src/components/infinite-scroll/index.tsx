import React, { useRef, useEffect } from 'react';
import { cn } from '../../utils/cn.js';

export interface InfiniteScrollProps {
  children: React.ReactNode;
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  loadingComponent?: React.ReactNode;
  endMessage?: React.ReactNode;
  threshold?: number;
  className?: string;
}

export function InfiniteScroll({
  children,
  hasMore,
  loading,
  onLoadMore,
  loadingComponent,
  endMessage,
  threshold = 0.1,
  className,
}: InfiniteScrollProps): JSX.Element {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) onLoadMore();
      },
      { threshold },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore, threshold]);

  return (
    <div className={cn('tokis-infinite-scroll', className)}>
      {children}
      {loading && (
        <div className="tokis-infinite-scroll__loading">
          {loadingComponent ?? <span className="tokis-infinite-scroll__spinner" aria-label="Loading more…" />}
        </div>
      )}
      {!hasMore && !loading && endMessage && (
        <div className="tokis-infinite-scroll__end">{endMessage}</div>
      )}
      <div ref={sentinelRef} className="tokis-infinite-scroll__sentinel" aria-hidden="true" />
    </div>
  );
}

InfiniteScroll.displayName = 'InfiniteScroll';
