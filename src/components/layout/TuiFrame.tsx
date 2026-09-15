import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './TuiFrame.module.css';

export interface TuiFrameProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  footer?: ReactNode;
}

export const TuiFrame = forwardRef<HTMLDivElement, TuiFrameProps>(function TuiFrame(
  { title, footer, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(styles.frame, className)} {...rest}>
      {title ? <div className={styles.title}>{title}</div> : null}
      <div className={styles.body}>{children}</div>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  );
});

export const TuiWindow = TuiFrame;
