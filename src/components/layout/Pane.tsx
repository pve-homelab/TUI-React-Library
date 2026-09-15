import {
  Children,
  forwardRef,
  useState,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import styles from './Pane.module.css';

export interface PaneProps extends HTMLAttributes<HTMLDivElement> {
  title?: ReactNode;
  focused?: boolean;
  scrollable?: boolean;
  headerActions?: ReactNode;
}

export const Pane = forwardRef<HTMLDivElement, PaneProps>(function Pane(
  {
    title,
    focused = false,
    scrollable = true,
    headerActions,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(styles.pane, focused && styles.focused, className)}
      data-focused={focused || undefined}
      {...rest}
    >
      {(title || headerActions) && (
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          {headerActions ? <div className={styles.actions}>{headerActions}</div> : null}
        </div>
      )}
      <div className={cx(styles.body, scrollable && styles.scrollable)}>{children}</div>
    </div>
  );
});

export interface SplitPaneProps extends HTMLAttributes<HTMLDivElement> {
  initialSizes?: number[];
  minSize?: number;
  children: ReactNode;
}

function useSplit(
  orientation: 'horizontal' | 'vertical',
  childCount: number,
  initialSizes: number[] | undefined,
  minSize: number,
) {
  const defaults =
    initialSizes && initialSizes.length === childCount
      ? initialSizes
      : Array.from({ length: childCount }, () => 100 / Math.max(childCount, 1));

  const [sizes, setSizes] = useState(defaults);

  const onPointerDown = (index: number) => (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const target = event.currentTarget.parentElement?.parentElement;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const startPos = orientation === 'horizontal' ? event.clientX : event.clientY;
    const startSizes = [...sizes];

    const onMove = (ev: PointerEvent) => {
      const pos = orientation === 'horizontal' ? ev.clientX : ev.clientY;
      const deltaPx = pos - startPos;
      const total = orientation === 'horizontal' ? rect.width : rect.height;
      const deltaPct = (deltaPx / total) * 100;
      const next = [...startSizes];
      const left = (next[index] ?? 0) + deltaPct;
      const right = (next[index + 1] ?? 0) - deltaPct;
      const minPct = (minSize / total) * 100;
      if (left < minPct || right < minPct) return;
      next[index] = left;
      next[index + 1] = right;
      setSizes(next);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return { sizes, onPointerDown };
}

export const SplitPaneHorizontal = forwardRef<HTMLDivElement, SplitPaneProps>(
  function SplitPaneHorizontal(
    { initialSizes, minSize = 80, children, className, style, ...rest },
    ref,
  ) {
    const items = Children.toArray(children);
    const { sizes, onPointerDown } = useSplit('horizontal', items.length, initialSizes, minSize);

    return (
      <div
        ref={ref}
        className={cx(styles.split, styles.horizontal, className)}
        style={style}
        {...rest}
      >
        {items.map((child, index) => (
          <div key={index} className={styles.splitItem} style={{ flexBasis: `${sizes[index]}%` }}>
            {child}
            {index < items.length - 1 ? (
              <div
                className={styles.gutterVertical}
                role="separator"
                aria-orientation="vertical"
                tabIndex={0}
                onPointerDown={onPointerDown(index)}
              />
            ) : null}
          </div>
        ))}
      </div>
    );
  },
);

export const SplitPaneVertical = forwardRef<HTMLDivElement, SplitPaneProps>(
  function SplitPaneVertical(
    { initialSizes, minSize = 60, children, className, style, ...rest },
    ref,
  ) {
    const items = Children.toArray(children);
    const { sizes, onPointerDown } = useSplit('vertical', items.length, initialSizes, minSize);

    return (
      <div
        ref={ref}
        className={cx(styles.split, styles.vertical, className)}
        style={style}
        {...rest}
      >
        {items.map((child, index) => (
          <div key={index} className={styles.splitItem} style={{ flexBasis: `${sizes[index]}%` }}>
            {child}
            {index < items.length - 1 ? (
              <div
                className={styles.gutterHorizontal}
                role="separator"
                aria-orientation="horizontal"
                tabIndex={0}
                onPointerDown={onPointerDown(index)}
              />
            ) : null}
          </div>
        ))}
      </div>
    );
  },
);
