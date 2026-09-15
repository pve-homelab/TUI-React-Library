import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './SessionBar.module.css';

export interface SessionTab {
  id: string;
  label: ReactNode;
  active?: boolean;
  badge?: ReactNode;
}

export interface SessionBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  sessions: SessionTab[];
  onSelect?: (id: string) => void;
  trailing?: ReactNode;
}

export const SessionBar = forwardRef<HTMLDivElement, SessionBarProps>(function SessionBar(
  { sessions, onSelect, trailing, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(styles.bar, className)} role="tablist" {...rest}>
      <div className={styles.tabs}>
        {sessions.map((session) => (
          <button
            key={session.id}
            type="button"
            role="tab"
            aria-selected={!!session.active}
            className={cx(styles.tab, session.active && styles.active)}
            onClick={() => onSelect?.(session.id)}
          >
            <span className={styles.label}>{session.label}</span>
            {session.badge != null ? <span className={styles.badge}>{session.badge}</span> : null}
          </button>
        ))}
      </div>
      {trailing ? <div className={styles.trailing}>{trailing}</div> : null}
    </div>
  );
});

export type TabBarProps = SessionBarProps;
export const TabBar = SessionBar;

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={cx(styles.iconButton, className)}
      {...rest}
    >
      {children}
    </button>
  );
});
