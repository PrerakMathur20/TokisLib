import React, { useCallback, useRef } from 'react';
import { cn } from '../../utils/cn.js';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TreeViewProps {
  data: TreeNode[];
  selected?: string[];
  onSelect?: (id: string) => void;
  expanded?: string[];
  onExpand?: (id: string) => void;
  multiSelect?: boolean;
  className?: string;
}

interface TreeItemProps {
  node: TreeNode;
  level: number;
  selected: string[];
  expanded: string[];
  onSelect: (id: string) => void;
  onExpand: (id: string) => void;
  multiSelect: boolean;
  allNodes: TreeNode[];
  onKeyNav: (id: string, direction: 'up' | 'down' | 'left' | 'right') => void;
}

function flattenVisible(nodes: TreeNode[], expanded: string[]): TreeNode[] {
  const result: TreeNode[] = [];
  function walk(items: TreeNode[]) {
    for (const node of items) {
      result.push(node);
      if (node.children && expanded.includes(node.id)) {
        walk(node.children);
      }
    }
  }
  walk(nodes);
  return result;
}

function TreeItem({
  node,
  level,
  selected,
  expanded,
  onSelect,
  onExpand,
  multiSelect,
  allNodes,
  onKeyNav,
}: TreeItemProps): JSX.Element {
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isExpanded = expanded.includes(node.id);
  const isSelected = selected.includes(node.id);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        if (hasChildren && !isExpanded) onExpand(node.id);
        else if (hasChildren && isExpanded) onKeyNav(node.id, 'down');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (hasChildren && isExpanded) onExpand(node.id);
        else onKeyNav(node.id, 'up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        onKeyNav(node.id, 'down');
        break;
      case 'ArrowUp':
        e.preventDefault();
        onKeyNav(node.id, 'up');
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!node.disabled) onSelect(node.id);
        break;
    }
  };

  return (
    <li role="none">
      <div
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        aria-disabled={node.disabled}
        aria-level={level}
        tabIndex={node.disabled ? -1 : 0}
        className={cn(
          'tokis-treeview__item',
          isSelected && 'tokis-treeview__item--selected',
          node.disabled && 'tokis-treeview__item--disabled'
        )}
        style={{ paddingInlineStart: `calc(${(level - 1) * 20}px + var(--tokis-spacing-2))` }}
        onClick={() => {
          if (node.disabled) return;
          if (hasChildren) onExpand(node.id);
          onSelect(node.id);
        }}
        onKeyDown={handleKeyDown}
        data-id={node.id}
      >
        {hasChildren ? (
          <span
            className={cn('tokis-treeview__chevron', isExpanded && 'tokis-treeview__chevron--open')}
            aria-hidden="true"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 3l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        ) : (
          <span className="tokis-treeview__leaf-spacer" aria-hidden="true" />
        )}
        {node.icon && (
          <span className="tokis-treeview__icon" aria-hidden="true">{node.icon}</span>
        )}
        <span className="tokis-treeview__label">{node.label}</span>
      </div>

      {hasChildren && isExpanded && (
        <ul
          role="group"
          className="tokis-treeview__group"
          aria-label={node.label}
        >
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              selected={selected}
              expanded={expanded}
              onSelect={onSelect}
              onExpand={onExpand}
              multiSelect={multiSelect}
              allNodes={allNodes}
              onKeyNav={onKeyNav}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TreeView({
  data,
  selected = [],
  onSelect,
  expanded = [],
  onExpand,
  multiSelect = false,
  className,
}: TreeViewProps): JSX.Element {
  const treeRef = useRef<HTMLUListElement>(null);

  const handleSelect = useCallback((id: string) => {
    onSelect?.(id);
  }, [onSelect]);

  const handleExpand = useCallback((id: string) => {
    onExpand?.(id);
  }, [onExpand]);

  const handleKeyNav = useCallback((currentId: string, direction: 'up' | 'down' | 'left' | 'right') => {
    const visible = flattenVisible(data, expanded);
    const currentIndex = visible.findIndex((n) => n.id === currentId);
    if (currentIndex === -1) return;

    let targetIndex: number | undefined;
    if (direction === 'down') targetIndex = Math.min(currentIndex + 1, visible.length - 1);
    if (direction === 'up') targetIndex = Math.max(currentIndex - 1, 0);

    if (targetIndex !== undefined && targetIndex !== currentIndex) {
      const targetId = visible[targetIndex].id;
      const el = treeRef.current?.querySelector<HTMLElement>(`[data-id="${targetId}"]`);
      el?.focus();
    }
  }, [data, expanded]);

  return (
    <ul
      ref={treeRef}
      role="tree"
      aria-multiselectable={multiSelect}
      className={cn('tokis-treeview', className)}
    >
      {data.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          level={1}
          selected={selected}
          expanded={expanded}
          onSelect={handleSelect}
          onExpand={handleExpand}
          multiSelect={multiSelect}
          allNodes={data}
          onKeyNav={handleKeyNav}
        />
      ))}
    </ul>
  );
}
