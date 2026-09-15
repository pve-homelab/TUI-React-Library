import {
  DndContext,
  DragOverlay,
  PointerSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type DropAnimation,
} from '@dnd-kit/core';
import { useEffect, useMemo, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx';
import { kanbanCollisionDetection } from './collision';
import { KanbanCard } from './KanbanCard';
import { KanbanCardContent } from './KanbanCardContent';
import { KanbanColumn } from './KanbanColumn';
import {
  applyCardMove,
  getCardColumnId,
  resolveDropTarget,
} from './reorder';
import type { KanbanCardData, KanbanCardRenderer, KanbanColumnData, KanbanMoveEvent } from './types';
import styles from './Kanban.module.css';

export interface KanbanBoardProps {
  columns: KanbanColumnData[];
  cards: KanbanCardData[];
  focusedColumnId?: string;
  selectedCardId?: string;
  /** Fired once when a drag completes (or on keyboard H/L). */
  onMove?: (event: KanbanMoveEvent) => void;
  onSelectCard?: (cardId: string) => void;
  renderCard?: KanbanCardRenderer;
  className?: string;
  children?: ReactNode;
}

const dropAnimation: DropAnimation = {
  duration: 180,
  easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
};

export function KanbanBoard({
  columns,
  cards,
  focusedColumnId,
  selectedCardId,
  onMove,
  onSelectCard,
  renderCard,
  className,
}: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [previewCards, setPreviewCards] = useState<KanbanCardData[] | null>(null);

  const displayCards = previewCards ?? cards;
  const columnIds = useMemo(() => columns.map((column) => column.id), [columns]);

  useEffect(() => {
    if (!activeId) {
      setPreviewCards(null);
    }
  }, [cards, activeId]);

  const activeCard = activeId
    ? displayCards.find((card) => card.id === activeId) ??
      cards.find((card) => card.id === activeId) ??
      null
    : null;

  const commitIfChanged = (next: KanbanCardData[], cardId: string) => {
    const fromColumnId = getCardColumnId(cards, cardId);
    const toColumnId = getCardColumnId(next, cardId);
    if (!fromColumnId || !toColumnId) return;

    const toIndex = next
      .filter((card) => card.columnId === toColumnId)
      .findIndex((card) => card.id === cardId);

    const fromIndex = cards
      .filter((card) => card.columnId === fromColumnId)
      .findIndex((card) => card.id === cardId);

    if (fromColumnId === toColumnId && fromIndex === toIndex) return;

    onMove?.({ cardId, fromColumnId, toColumnId, toIndex: Math.max(0, toIndex) });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    setActiveId(id);
    setPreviewCards(cards);
    onSelectCard?.(id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const cardId = String(active.id);
    const overId = String(over.id);
    if (cardId === overId) return;

    setPreviewCards((current) => {
      const base = current ?? cards;
      const fromColumnId = getCardColumnId(base, cardId);
      const target = resolveDropTarget(base, columnIds, overId);
      if (!fromColumnId || !target) return base;

      // Dropping on the column container places at end; when hovering another card,
      // insert before that card — unless we're coming from above in the same column
      // and the pointer is past the midpoint (dnd-kit sortable handles via index).
      let toIndex = target.index;
      if (target.columnId === fromColumnId) {
        const columnCards = base.filter((card) => card.columnId === fromColumnId);
        const fromIndex = columnCards.findIndex((card) => card.id === cardId);
        if (fromIndex < toIndex) {
          toIndex = Math.max(0, toIndex - 1);
        }
      }

      if (fromColumnId === target.columnId) {
        const columnCards = base.filter((card) => card.columnId === fromColumnId);
        const fromIndex = columnCards.findIndex((card) => card.id === cardId);
        if (fromIndex === toIndex) return base;
      }

      return applyCardMove(base, {
        cardId,
        fromColumnId,
        toColumnId: target.columnId,
        toIndex,
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const cardId = String(active.id);
    const draft = previewCards ?? cards;

    if (over) {
      const overId = String(over.id);
      const fromColumnId = getCardColumnId(draft, cardId) ?? getCardColumnId(cards, cardId);
      const target = resolveDropTarget(draft, columnIds, overId);
      if (fromColumnId && target) {
        let toIndex = target.index;
        if (target.columnId === fromColumnId) {
          const columnCards = draft.filter((card) => card.columnId === fromColumnId);
          const fromIndex = columnCards.findIndex((card) => card.id === cardId);
          if (fromIndex < toIndex) toIndex = Math.max(0, toIndex - 1);
        }
        const next = applyCardMove(draft, {
          cardId,
          fromColumnId,
          toColumnId: target.columnId,
          toIndex,
        });
        commitIfChanged(next, cardId);
      } else {
        commitIfChanged(draft, cardId);
      }
    } else {
      commitIfChanged(draft, cardId);
    }

    setActiveId(null);
    setPreviewCards(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setPreviewCards(null);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!selectedCardId) return;
    if (event.key !== 'H' && event.key !== 'L') return;
    const card = cards.find((item) => item.id === selectedCardId);
    if (!card) return;
    const columnIndex = columns.findIndex((column) => column.id === card.columnId);
    if (columnIndex < 0) return;
    const nextIndex = event.key === 'H' ? columnIndex - 1 : columnIndex + 1;
    const nextColumn = columns[nextIndex];
    if (!nextColumn) return;
    event.preventDefault();
    onMove?.({
      cardId: card.id,
      fromColumnId: card.columnId,
      toColumnId: nextColumn.id,
      toIndex: cards.filter((item) => item.columnId === nextColumn.id).length,
    });
  };

  const overlay =
    typeof document !== 'undefined' && activeCard
      ? createPortal(
          <DragOverlay dropAnimation={dropAnimation} className={styles.dragOverlay}>
            {renderCard ? (
              renderCard(activeCard)
            ) : (
              <KanbanCardContent card={activeCard} selected overlay />
            )}
          </DragOverlay>,
          document.body,
        )
      : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={kanbanCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className={cx(styles.board, className)} tabIndex={0} onKeyDown={onKeyDown}>
        {columns.map((column) => {
          const columnCards = displayCards.filter((card) => card.columnId === column.id);
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={columnCards}
              focused={focusedColumnId === column.id}
            >
              {columnCards.map((card) =>
                renderCard ? (
                  renderCard(card)
                ) : (
                  <KanbanCard
                    key={card.id}
                    card={card}
                    selected={selectedCardId === card.id}
                    onClick={() => onSelectCard?.(card.id)}
                  />
                ),
              )}
            </KanbanColumn>
          );
        })}
      </div>
      {overlay}
    </DndContext>
  );
}
