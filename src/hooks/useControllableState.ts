import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from 'react';

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): [T, Dispatch<SetStateAction<T>>] {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : uncontrolled;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      const resolved =
        typeof next === 'function' ? (next as (prev: T) => T)(current as T) : next;
      if (!isControlled) {
        setUncontrolled(resolved);
      }
      onChangeRef.current?.(resolved);
    },
    [current, isControlled],
  );

  return [current as T, setValue];
}
