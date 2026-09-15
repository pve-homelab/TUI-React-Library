import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { useControllableState } from '../../hooks/useControllableState';
import { useId } from '../../hooks/useId';
import { cx } from '../../utils/cx';
import styles from './Radio.module.css';

interface RadioGroupContextValue {
  name: string;
  value: string;
  disabled?: boolean;
  setValue: (value: string) => void;
  register: (value: string, el: HTMLInputElement | null) => void;
  move: (current: string, direction: 1 | -1) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  children?: ReactNode;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    name: nameProp,
    value,
    defaultValue = '',
    onChange,
    disabled,
    children,
    className,
    ...rest
  },
  ref,
) {
  const autoName = useId('radio-group');
  const name = nameProp ?? autoName;
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange,
  });
  const itemsRef = useRef<Map<string, HTMLInputElement>>(new Map());
  const orderRef = useRef<string[]>([]);

  const register = useCallback((itemValue: string, el: HTMLInputElement | null) => {
    if (el) {
      itemsRef.current.set(itemValue, el);
      if (!orderRef.current.includes(itemValue)) {
        orderRef.current.push(itemValue);
      }
    } else {
      itemsRef.current.delete(itemValue);
      orderRef.current = orderRef.current.filter((v) => v !== itemValue);
    }
  }, []);

  const move = useCallback(
    (from: string, direction: 1 | -1) => {
      const order = orderRef.current.filter((v) => {
        const el = itemsRef.current.get(v);
        return el && !el.disabled;
      });
      if (order.length === 0) return;
      const index = order.indexOf(from);
      const nextIndex = index === -1 ? 0 : (index + direction + order.length) % order.length;
      const nextValue = order[nextIndex];
      if (!nextValue) return;
      setCurrent(nextValue);
      itemsRef.current.get(nextValue)?.focus();
    },
    [setCurrent],
  );

  const ctx = useMemo<RadioGroupContextValue>(
    () => ({
      name,
      value: current,
      disabled,
      setValue: setCurrent,
      register,
      move,
    }),
    [name, current, disabled, setCurrent, register, move],
  );

  return (
    <RadioGroupContext.Provider value={ctx}>
      <div
        {...rest}
        ref={ref}
        role="radiogroup"
        className={cx(styles.group, className)}
        aria-disabled={disabled || undefined}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
});

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'checked' | 'value'> {
  value: string;
  children?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, disabled, children, className, id: idProp, ...rest },
  ref,
) {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error('Radio must be used within a RadioGroup');
  }

  const autoId = useId('radio');
  const id = idProp ?? autoId;
  const isChecked = ctx.value === value;
  const isDisabled = disabled || ctx.disabled;
  const innerRef = useRef<HTMLInputElement | null>(null);

  const setRefs = (node: HTMLInputElement | null) => {
    innerRef.current = node;
    ctx.register(value, node);
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      ctx.setValue(value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      ctx.move(value, 1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      ctx.move(value, -1);
    }
  };

  return (
    <label className={cx(styles.root, isDisabled && styles.disabled, className)} htmlFor={id}>
      <input
        {...rest}
        ref={setRefs}
        id={id}
        type="radio"
        className={styles.input}
        name={ctx.name}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <span className={styles.dot} aria-hidden="true" />
      {children != null ? <span className={styles.label}>{children}</span> : null}
    </label>
  );
});
