import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { useControllableState } from '../../hooks/useControllableState';
import { useId } from '../../hooks/useId';
import { cx } from '../../utils/cx';
import styles from './Toggle.module.css';

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    checked,
    defaultChecked = false,
    onChange,
    disabled,
    label,
    className,
    id: idProp,
    ...rest
  },
  ref,
) {
  const autoId = useId('toggle');
  const id = idProp ?? autoId;
  const [isChecked, setChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange,
  });

  return (
    <div className={cx(styles.root, disabled && styles.disabled, className)}>
      <button
        {...rest}
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        className={styles.track}
        onClick={() => setChecked(!isChecked)}
      >
        <span className={styles.thumb} aria-hidden="true" />
      </button>
      {label != null ? (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      ) : null}
    </div>
  );
});
