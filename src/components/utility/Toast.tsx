import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import styles from './Toast.module.css';

const DEFAULT_DURATION_MS = 4000;

export interface ToastOptions {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  durationMs?: number;
}

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  onDismiss?: () => void;
}

interface ToastEntry {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  durationMs: number;
}

interface ToastContextValue {
  publish: (opts: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastIdCounter = 0;

function nextToastId(): string {
  toastIdCounter += 1;
  return `toast-${toastIdCounter}`;
}

export function Toast({ title, description, onDismiss, className, ...rest }: ToastProps) {
  return (
    <div className={cx(styles.toast, className)} role="listitem" {...rest}>
      <div className={styles.body}>
        <div className={styles.title}>{title}</div>
        {description != null ? <div className={styles.description}>{description}</div> : null}
      </div>
      {onDismiss ? (
        <button type="button" className={styles.dismiss} aria-label="Dismiss" onClick={onDismiss}>
          ×
        </button>
      ) : null}
    </div>
  );
}

export interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const clearTimer = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer != null) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      clearTimer(id);
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    },
    [clearTimer],
  );

  const publish = useCallback(
    (opts: ToastOptions): string => {
      const id = opts.id ?? nextToastId();
      const durationMs = opts.durationMs ?? DEFAULT_DURATION_MS;
      const entry: ToastEntry = {
        id,
        title: opts.title,
        description: opts.description,
        durationMs,
      };

      clearTimer(id);
      setToasts((prev) => {
        const without = prev.filter((toast) => toast.id !== id);
        return [...without, entry];
      });

      if (durationMs > 0) {
        const timer = setTimeout(() => {
          timersRef.current.delete(id);
          setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, durationMs);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [clearTimer],
  );

  useEffect(() => {
    return () => {
      for (const timer of timersRef.current.values()) {
        clearTimeout(timer);
      }
      timersRef.current.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ publish, dismiss }), [publish, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.region} aria-live="polite" aria-relevant="additions text" role="status">
        <div className={styles.list} role="list">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              title={toast.title}
              description={toast.description}
              onDismiss={() => dismiss(toast.id)}
            />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
