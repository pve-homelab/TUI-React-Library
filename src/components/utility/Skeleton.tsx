import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import styles from './Skeleton.module.css';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ width, height, className, style, ...rest }: SkeletonProps) {
  const mergedStyle: CSSProperties = {
    ...style,
    ...(width != null ? { width } : null),
    ...(height != null ? { height } : null),
  };

  return (
    <div
      className={cx(styles.skeleton, className)}
      style={mergedStyle}
      aria-hidden="true"
      {...rest}
    />
  );
}
