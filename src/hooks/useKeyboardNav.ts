import { useCallback, useEffect, useState, type KeyboardEvent } from 'react';

export interface KeyboardNavOptions {
  count: number;
  loop?: boolean;
  orientation?: 'vertical' | 'horizontal';
  enabled?: boolean;
  onSelect?: (index: number) => void;
  /** When true for an index, arrow / Home / End navigation skips it. */
  isDisabled?: (index: number) => boolean;
}

function findEnabledIndex(
  count: number,
  start: number,
  delta: number,
  loop: boolean,
  isDisabled?: (index: number) => boolean,
): number {
  if (count === 0) return 0;

  let next = start;
  for (let stepped = 0; stepped < count; stepped += 1) {
    next += delta;
    if (loop) {
      next = ((next % count) + count) % count;
    } else if (next < 0 || next >= count) {
      return start;
    }
    if (!isDisabled?.(next)) {
      return next;
    }
  }

  return start;
}

function findEdgeEnabledIndex(
  count: number,
  fromEnd: boolean,
  isDisabled?: (index: number) => boolean,
): number {
  if (count === 0) return 0;

  if (fromEnd) {
    for (let i = count - 1; i >= 0; i -= 1) {
      if (!isDisabled?.(i)) return i;
    }
  } else {
    for (let i = 0; i < count; i += 1) {
      if (!isDisabled?.(i)) return i;
    }
  }

  return fromEnd ? count - 1 : 0;
}

export function useKeyboardNav({
  count,
  loop = true,
  orientation = 'vertical',
  enabled = true,
  onSelect,
  isDisabled,
}: KeyboardNavOptions) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (count === 0) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((i) => Math.min(i, count - 1));
  }, [count]);

  const move = useCallback(
    (delta: number) => {
      if (count === 0) return;
      setActiveIndex((current) => findEnabledIndex(count, current, delta, loop, isDisabled));
    },
    [count, isDisabled, loop],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || count === 0) return;

      const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
      const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
      const vimPrev = orientation === 'vertical' ? 'k' : 'h';
      const vimNext = orientation === 'vertical' ? 'j' : 'l';

      if (event.key === prevKey || event.key === vimPrev) {
        event.preventDefault();
        move(-1);
      } else if (event.key === nextKey || event.key === vimNext) {
        event.preventDefault();
        move(1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        setActiveIndex(findEdgeEnabledIndex(count, false, isDisabled));
      } else if (event.key === 'End') {
        event.preventDefault();
        setActiveIndex(findEdgeEnabledIndex(count, true, isDisabled));
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (!isDisabled?.(activeIndex)) {
          onSelect?.(activeIndex);
        }
      }
    },
    [activeIndex, count, enabled, isDisabled, move, onSelect, orientation],
  );

  return { activeIndex, setActiveIndex, onKeyDown, move };
}
