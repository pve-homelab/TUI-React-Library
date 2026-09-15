import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { KanbanCardData } from './types';
import styles from './Kanban.module.css';

const STATUS_GLYPH: Record<NonNullable<KanbanCardData['status']>, string> = {
  idle: '○',
  working: '●',
  blocked: '◉',
  done: '✔',
};

export interface KanbanCardContentProps {
  card: KanbanCardData;
  selected?: boolean;
  dragging?: boolean;
  overlay?: boolean;
  className?: string;
  children?: ReactNode;
}

export function KanbanCardContent({
  card,
  selected,
  dragging,
  overlay,
  className,
}: KanbanCardContentProps) {
  return (
    <div
      className={cx(
        styles.card,
        selected && styles.cardSelected,
        dragging && styles.cardDragging,
        overlay && styles.cardOverlay,
        className,
      )}
    >
      <header className={styles.cardHeader}>
        <span className={cx(styles.status, card.status && styles[card.status])}>
          {card.status ? STATUS_GLYPH[card.status] : '·'}
        </span>
        <h3 className={styles.cardTitle}>{card.title}</h3>
      </header>
      {card.description ? <p className={styles.cardBody}>{card.description}</p> : null}
      <footer className={styles.cardMeta}>
        {card.tags?.map((tag) => (
          <span key={tag.id} className={styles.tag}>
            {tag.label}
          </span>
        ))}
        {card.meta ? <span className={styles.meta}>{card.meta}</span> : null}
      </footer>
    </div>
  );
}
