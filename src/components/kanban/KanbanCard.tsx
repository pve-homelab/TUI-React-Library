import { forwardRef, type HTMLAttributes } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cx } from '../../utils/cx';
import { KanbanCardContent } from './KanbanCardContent';
import type { KanbanCardData } from './types';
import styles from './Kanban.module.css';

export interface KanbanCardProps extends HTMLAttributes<HTMLElement> {
  card: KanbanCardData;
  selected?: boolean;
  sortable?: boolean;
}

export const KanbanCard = forwardRef<HTMLElement, KanbanCardProps>(function KanbanCard(
  { card, selected, sortable = true, className, style, ...rest },
  forwardedRef,
) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    disabled: !sortable,
    data: { type: 'card', card, columnId: card.columnId },
  });

  const combinedRef = (node: HTMLElement | null) => {
    setNodeRef(node);
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  return (
    <article
      ref={combinedRef}
      className={cx(styles.sortableItem, isDragging && styles.sortablePlaceholder, className)}
      style={{
        ...style,
        transform: isDragging ? undefined : CSS.Transform.toString(transform),
        transition: isDragging ? undefined : transition,
      }}
      {...attributes}
      {...listeners}
      {...rest}
    >
      <KanbanCardContent card={card} selected={selected} dragging={isDragging} />
    </article>
  );
});
