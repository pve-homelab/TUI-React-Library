import {
  forwardRef,
  useEffect,
  useRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { useControllableState } from '../../hooks/useControllableState';
import { useId } from '../../hooks/useId';
import { cx } from '../../utils/cx';
import styles from './Checkbox.module.css';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'checked' | 'defaultChecked'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    checked,
    defaultChecked = false,
    onChange,
    disabled,
    label,
    indeterminate = false,
    className,
    id: idProp,
    ...rest
  },
  ref,
) {
  const autoId = useId('checkbox');
  const id = idProp ?? autoId;
  const [isChecked, setChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange,
  });
  const innerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate, isChecked]);

  const setRefs = (node: HTMLInputElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <label className={cx(styles.root, disabled && styles.disabled, className)} htmlFor={id}>
      <input
        {...rest}
        ref={setRefs}
        id={id}
        type="checkbox"
        className={styles.input}
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        aria-checked={indeterminate ? 'mixed' : isChecked}
      />
      <span className={styles.box} aria-hidden="true" />
      {label != null ? <span className={styles.label}>{label}</span> : null}
    </label>
  );
});
