import {
  forwardRef,
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { useKeyboardNav } from '../../hooks/useKeyboardNav';
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
  { sessions, onSelect, trailing, className, onKeyDown, ...rest },
  ref,
) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const { activeIndex, setActiveIndex, onKeyDown: onNavKeyDown } = useKeyboardNav({
    count: sessions.length,
    orientation: 'horizontal',
    onSelect: (index) => {
      const session = sessions[index];
      if (session) onSelect?.(session.id);
    },
  });

  useEffect(() => {
    const selected = sessions.findIndex((session) => session.active);
    if (selected >= 0) setActiveIndex(selected);
  }, [sessions, setActiveIndex]);

  useEffect(() => {
    const root = rootRef.current;
    const activeEl = document.activeElement;
    if (!root || !activeEl || !root.contains(activeEl)) return;
    tabRefs.current[activeIndex]?.focus({ preventScroll: true });
  }, [activeIndex]);

  const setRootRef = (node: HTMLDivElement | null) => {
    rootRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onNavKeyDown(event);
    onKeyDown?.(event);
  };

  return (
    <div
      ref={setRootRef}
      className={cx(styles.bar, className)}
      role="tablist"
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <div className={styles.tabs}>
        {sessions.map((session, index) => (
          <button
            key={session.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            tabIndex={index === activeIndex ? 0 : -1}
            aria-selected={!!session.active}
            className={cx(styles.tab, session.active && styles.active)}
            onFocus={() => setActiveIndex(index)}
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
