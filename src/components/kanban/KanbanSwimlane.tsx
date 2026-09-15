import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Kanban.module.css';

export interface KanbanSwimlaneProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}

export function KanbanSwimlane({
  title,
  subtitle,
  children,
  className,
  ...rest
}: KanbanSwimlaneProps) {
  return (
    <section className={cx(styles.swimlane, className)} data-swimlane {...rest}>
      <header className={styles.swimlaneHeader}>
        <div>
          <h2 className={styles.swimlaneTitle}>{title}</h2>
          {subtitle ? <p className={styles.swimlaneSubtitle}>{subtitle}</p> : null}
        </div>
      </header>
      <div className={styles.swimlaneBody}>{children}</div>
    </section>
  );
}
