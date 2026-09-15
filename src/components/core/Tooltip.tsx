import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  type MutableRefObject,
} from 'react';
import { useId } from '../../hooks/useId';
import { cx } from '../../utils/cx';
import styles from './Tooltip.module.css';

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as MutableRefObject<T | null>).current = node;
      }
    }
  };
}

type TriggerElement = ReactElement<
  HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> }
>;

export interface TooltipProps {
  content: ReactNode;
  children: TriggerElement;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId('tooltip');
  const triggerRef = useRef<HTMLElement | null>(null);

  const child = Children.only(children);
  if (!isValidElement(child)) {
    throw new Error('Tooltip expects a single React element child as the trigger');
  }

  const trigger = cloneElement(child, {
    ref: mergeRefs(child.props.ref, triggerRef),
    'aria-describedby': open ? tooltipId : undefined,
    onMouseEnter: (event: ReactMouseEvent<HTMLElement>) => {
      child.props.onMouseEnter?.(event);
      setOpen(true);
    },
    onMouseLeave: (event: ReactMouseEvent<HTMLElement>) => {
      child.props.onMouseLeave?.(event);
      setOpen(false);
    },
    onFocus: (event: ReactFocusEvent<HTMLElement>) => {
      child.props.onFocus?.(event);
      setOpen(true);
    },
    onBlur: (event: ReactFocusEvent<HTMLElement>) => {
      child.props.onBlur?.(event);
      setOpen(false);
    },
  });

  return (
    <div className={cx(styles.root, className)}>
      {trigger}
      {open ? (
        <div id={tooltipId} role="tooltip" className={styles.content}>
          {content}
        </div>
      ) : null}
    </div>
  );
}
