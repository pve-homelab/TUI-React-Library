import { useCallback, useEffect, useState, type KeyboardEvent } from 'react';

export interface KeyboardNavOptions {
  count: number;
  loop?: boolean;
  orientation?: 'vertical' | 'horizontal';
  enabled?: boolean;
  onSelect?: (index: number) => void;
}

export function useKeyboardNav({
  count,
  loop = true,
  orientation = 'vertical',
  enabled = true,
  onSelect,
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
      setActiveIndex((current) => {
        const next = current + delta;
        if (loop) {
          return ((next % count) + count) % count;
        }
        return Math.max(0, Math.min(count - 1, next));
      });
    },
    [count, loop],
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
        setActiveIndex(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        setActiveIndex(count - 1);
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect?.(activeIndex);
      }
    },
    [activeIndex, count, enabled, move, onSelect, orientation],
  );

  return { activeIndex, setActiveIndex, onKeyDown, move };
}
