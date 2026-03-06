import React, { useMemo } from 'react';
import { cn } from '../../utils/cn.js';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

function range(start: number, end: number): number[] {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
}

function usePaginationItems(page: number, totalPages: number, siblingCount: number): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  return useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 ellipsis

    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
      const leftRange = range(1, 3 + siblingCount * 2);
      return [...leftRange, 'ellipsis-end', totalPages];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
      const rightRange = range(totalPages - (2 + siblingCount * 2), totalPages);
      return [1, 'ellipsis-start', ...rightRange];
    }

    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [1, 'ellipsis-start', ...middleRange, 'ellipsis-end', totalPages];
  }, [page, totalPages, siblingCount]);
}

export function Pagination({
  page,
  totalPages,
  onChange,
  siblingCount = 1,
  className,
}: PaginationProps): JSX.Element {
  const items = usePaginationItems(page, totalPages, siblingCount);

  const handlePrev = () => { if (page > 1) onChange(page - 1); };
  const handleNext = () => { if (page < totalPages) onChange(page + 1); };

  return (
    <nav
      className={cn('tokis-pagination', className)}
      aria-label="Pagination navigation"
      role="navigation"
    >
      <button
        className={cn('tokis-pagination__item', 'tokis-pagination__prev', page === 1 && 'tokis-pagination__item--disabled')}
        onClick={handlePrev}
        disabled={page === 1}
        aria-label="Go to previous page"
        aria-disabled={page === 1}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {items.map((item, index) => {
        if (item === 'ellipsis-start' || item === 'ellipsis-end') {
          return (
            <span key={item} className="tokis-pagination__ellipsis" aria-hidden="true">
              &hellip;
            </span>
          );
        }

        const isActive = item === page;
        return (
          <button
            key={`${item}-${index}`}
            className={cn('tokis-pagination__item', isActive && 'tokis-pagination__item--active')}
            onClick={() => onChange(item)}
            aria-label={`Go to page ${item}`}
            aria-current={isActive ? 'page' : undefined}
            disabled={isActive}
          >
            {item}
          </button>
        );
      })}

      <button
        className={cn('tokis-pagination__item', 'tokis-pagination__next', page === totalPages && 'tokis-pagination__item--disabled')}
        onClick={handleNext}
        disabled={page === totalPages}
        aria-label="Go to next page"
        aria-disabled={page === totalPages}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  );
}
