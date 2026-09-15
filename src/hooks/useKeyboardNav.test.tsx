import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useKeyboardNav } from './useKeyboardNav';

function NavHarness({
  count,
  isDisabled,
  onSelect,
  orientation = 'vertical',
  loop = true,
}: {
  count: number;
  isDisabled?: (index: number) => boolean;
  onSelect?: (index: number) => void;
  orientation?: 'vertical' | 'horizontal';
  loop?: boolean;
}) {
  const { activeIndex, onKeyDown } = useKeyboardNav({
    count,
    isDisabled,
    onSelect,
    orientation,
    loop,
  });

  return (
    <div
      tabIndex={0}
      role="listbox"
      aria-label="Nav"
      aria-activedescendant={`item-${activeIndex}`}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => onKeyDown(event)}
      data-active-index={activeIndex}
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          id={`item-${index}`}
          role="option"
          aria-disabled={isDisabled?.(index) || undefined}
          data-active={index === activeIndex || undefined}
        >
          Item {index}
        </div>
      ))}
    </div>
  );
}

describe('useKeyboardNav', () => {
  it('skips disabled indices with ArrowDown / ArrowUp', async () => {
    const user = userEvent.setup();
    const disabled = new Set([1, 2]);
    render(
      <NavHarness count={5} isDisabled={(index) => disabled.has(index)} />,
    );

    const root = screen.getByRole('listbox');
    root.focus();

    expect(root).toHaveAttribute('data-active-index', '0');

    await user.keyboard('{ArrowDown}');
    expect(root).toHaveAttribute('data-active-index', '3');

    await user.keyboard('{ArrowUp}');
    expect(root).toHaveAttribute('data-active-index', '0');
  });

  it('Home and End land on the nearest enabled edge', async () => {
    const user = userEvent.setup();
    const disabled = new Set([0, 4]);
    render(
      <NavHarness count={5} isDisabled={(index) => disabled.has(index)} />,
    );

    const root = screen.getByRole('listbox');
    root.focus();

    await user.keyboard('{End}');
    expect(root).toHaveAttribute('data-active-index', '3');

    await user.keyboard('{Home}');
    expect(root).toHaveAttribute('data-active-index', '1');
  });

  it('does not call onSelect for a disabled active index', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    function DisabledActive() {
      const { activeIndex, setActiveIndex, onKeyDown } = useKeyboardNav({
        count: 3,
        isDisabled: (index) => index === 1,
        onSelect,
      });

      return (
        <div>
          <button type="button" onClick={() => setActiveIndex(1)}>
            Focus disabled
          </button>
          <div
            tabIndex={0}
            role="listbox"
            aria-label="Disabled select"
            data-active-index={activeIndex}
            onKeyDown={onKeyDown}
          />
        </div>
      );
    }

    render(<DisabledActive />);
    await user.click(screen.getByRole('button', { name: 'Focus disabled' }));

    const root = screen.getByRole('listbox');
    expect(root).toHaveAttribute('data-active-index', '1');
    root.focus();

    await user.keyboard('{Enter}');
    expect(onSelect).not.toHaveBeenCalled();
  });
});
