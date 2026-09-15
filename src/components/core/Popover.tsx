import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  type MutableRefObject,
} from 'react';
import { useControllableState } from '../../hooks/useControllableState';
import { useId } from '../../hooks/useId';
import { cx } from '../../utils/cx';
import styles from './Popover.module.css';

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

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  content: ReactNode;
  children: TriggerElement;
  className?: string;
}

export function Popover({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  content,
  children,
  className,
}: PopoverProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const contentId = useId('popover');
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  const child = Children.only(children);
  if (!isValidElement(child)) {
    throw new Error('Popover expects a single React element child as the trigger');
  }

  const trigger = cloneElement(child, {
    ref: mergeRefs(child.props.ref, triggerRef),
    'aria-expanded': open,
    'aria-haspopup': 'dialog',
    'aria-controls': open ? contentId : undefined,
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      child.props.onClick?.(event);
      if (event.defaultPrevented) return;
      setOpen((prev) => !prev);
    },
  });

  return (
    <div className={cx(styles.root, className)}>
      {trigger}
      {open ? (
        <div id={contentId} role="dialog" className={styles.content}>
          {content}
        </div>
      ) : null}
    </div>
  );
}
