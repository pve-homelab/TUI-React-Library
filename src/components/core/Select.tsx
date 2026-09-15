import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { useControllableState } from '../../hooks/useControllableState';
import { useId } from '../../hooks/useId';
import { useKeyboardNav } from '../../hooks/useKeyboardNav';
import { cx } from '../../utils/cx';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value' | 'defaultValue'> {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    value,
    defaultValue = '',
    onChange,
    placeholder = 'Select…',
    disabled,
    id: idProp,
    className,
    ...rest
  },
  ref,
) {
  const autoId = useId('select');
  const id = idProp ?? autoId;
  const listboxId = `${id}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange,
  });

  const selectedIndex = options.findIndex((opt) => opt.value === current);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const { activeIndex, setActiveIndex, onKeyDown: onNavKeyDown } = useKeyboardNav({
    count: options.length,
    enabled: open && !disabled,
    onSelect: (index) => {
      const option = options[index];
      if (!option || option.disabled) return;
      setCurrent(option.value);
      setOpen(false);
    },
  });

  useEffect(() => {
    if (!open) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, selectedIndex, setActiveIndex]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && rootRef.current && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const triggerLabel = selected?.label ?? placeholder;

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === 'Tab') {
      setOpen(false);
      return;
    }

    onNavKeyDown(event);
  };

  return (
    <div ref={rootRef} className={cx(styles.root, disabled && styles.disabled, className)}>
      <button
        {...rest}
        ref={ref}
        id={id}
        type="button"
        disabled={disabled}
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => !prev);
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className={cx(styles.value, !selected && styles.placeholder)}>{triggerLabel}</span>
        <span className={styles.caret} aria-hidden="true">
          ▾
        </span>
      </button>
      {open ? (
        <ul id={listboxId} className={styles.listbox} role="listbox" tabIndex={-1}>
          {options.map((option, index) => {
            const isSelected = option.value === current;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                className={cx(
                  styles.option,
                  isSelected && styles.selected,
                  isActive && styles.focused,
                  option.disabled && styles.optionDisabled,
                )}
                onMouseEnter={() => {
                  if (!option.disabled) setActiveIndex(index);
                }}
                onClick={() => {
                  if (option.disabled) return;
                  setCurrent(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
});

export const Dropdown = Select;
