import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './StatusBar.module.css';

export interface StatusBarProps extends HTMLAttributes<HTMLDivElement> {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}

export const StatusBar = forwardRef<HTMLDivElement, StatusBarProps>(function StatusBar(
  { left, center, right, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(styles.bar, className)} role="status" {...rest}>
      <div className={styles.segment}>{left}</div>
      <div className={cx(styles.segment, styles.center)}>{center}</div>
      <div className={cx(styles.segment, styles.right)}>{right}</div>
    </div>
  );
});
