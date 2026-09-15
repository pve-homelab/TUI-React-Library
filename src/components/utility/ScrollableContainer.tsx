import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './ScrollableContainer.module.css';

export interface ScrollableContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxHeight?: string | number;
  children?: ReactNode;
}

export function ScrollableContainer({
  maxHeight,
  className,
  style,
  children,
  tabIndex = 0,
  ...rest
}: ScrollableContainerProps) {
  const mergedStyle: CSSProperties = {
    ...style,
    ...(maxHeight != null ? { maxHeight } : null),
  };

  return (
    <div
      className={cx(styles.container, className)}
      style={mergedStyle}
      tabIndex={tabIndex}
      {...rest}
    >
      {children}
    </div>
  );
}
