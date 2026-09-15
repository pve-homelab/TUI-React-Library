import { cx } from '../../utils/cx';
import styles from './KeyboardShortcutHint.module.css';

export interface KeyboardShortcutHintProps {
  keys: string[];
  label?: string;
  className?: string;
}

export function KeyboardShortcutHint({ keys, label, className }: KeyboardShortcutHintProps) {
  return (
    <span className={cx(styles.hint, className)}>
      {keys.map((key) => (
        <kbd key={key} className={styles.key}>
          {key}
        </kbd>
      ))}
      {label ? <span className={styles.label}>{label}</span> : null}
    </span>
  );
}
