import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import styles from './LoadingSpinner.module.css';

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function LoadingSpinner({ label = 'Loading', className, ...rest }: LoadingSpinnerProps) {
  return (
    <div className={cx(styles.root, className)} {...rest} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
