import { useId as useReactId } from 'react';

/** Stable ID helper that works under SSR and concurrent React. */
export function useId(prefix = 'tui'): string {
  const id = useReactId();
  return `${prefix}-${id.replace(/:/g, '')}`;
}
