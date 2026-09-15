import {
  forwardRef,
  useEffect,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type MutableRefObject,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { useId } from '../../hooks/useId';
import { themeToCssVars } from '../../theme/cssVars';
import { useThemeOptional } from '../../theme/ThemeProvider';
import { cx } from '../../utils/cx';
import styles from './Modal.module.css';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
  );
}

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

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  closeOnBackdrop?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    open,
    onClose,
    title,
    children,
    closeOnBackdrop = true,
    initialFocusRef,
    className,
    style,
    ...rest
  },
  ref,
) {
  const theme = useThemeOptional();
  const titleId = useId('modal-title');
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const setDialogRef = mergeRefs(dialogRef, ref);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const dialog = dialogRef.current;
    const focusTarget =
      initialFocusRef?.current ??
      (dialog ? getFocusableElements(dialog)[0] : null) ??
      dialog;

    focusTarget?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !dialogRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !dialogRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocusRef.current?.focus?.();
      previousFocusRef.current = null;
    };
  }, [open, onClose, initialFocusRef]);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  const themeStyle: CSSProperties | undefined = theme
    ? { ...themeToCssVars(theme.theme), backgroundColor: 'transparent' }
    : undefined;

  return createPortal(
    <div className={styles.overlay} style={themeStyle} data-testid="tui-modal-overlay">
      <div
        className={styles.backdrop}
        data-testid="tui-modal-backdrop"
        aria-hidden="true"
        onClick={() => {
          if (closeOnBackdrop) onClose();
        }}
      />
      <div
        {...rest}
        ref={setDialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        tabIndex={-1}
        className={cx(styles.dialog, className)}
        style={style}
      >
        {title != null ? (
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
        ) : null}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  );
});
