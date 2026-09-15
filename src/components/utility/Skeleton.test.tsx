import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders a placeholder element', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies width and height styles when provided', () => {
    const { container } = render(<Skeleton width="8rem" height="1.25rem" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('8rem');
    expect(el.style.height).toBe('1.25rem');
  });
});
