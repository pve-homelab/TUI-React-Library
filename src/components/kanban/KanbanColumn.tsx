import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { KanbanCardData, KanbanColumnData } from './types';
import styles from './Kanban.module.css';

export interface KanbanColumnProps {
  column: KanbanColumnData;
  cards: KanbanCardData[];
  focused?: boolean;
  children?: ReactNode;
}

export function KanbanColumn({ column, cards, focused, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', columnId: column.id },
  });

  return (
    <section
      ref={setNodeRef}
      className={cx(styles.column, focused && styles.columnFocused, isOver && styles.columnOver)}
      data-column-id={column.id}
    >
      <header className={styles.columnHeader}>
        <div>
          <h2 className={styles.columnTitle}>{column.title}</h2>
          {column.subtitle ? <p className={styles.columnSubtitle}>{column.subtitle}</p> : null}
        </div>
        <span className={styles.count}>{cards.length}</span>
      </header>
      <div className={styles.columnBody}>
        <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </div>
    </section>
  );
}
