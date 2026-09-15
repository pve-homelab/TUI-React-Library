import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../theme';
import { Menu } from './Menu';

function wrap(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Menu', () => {
  it('exposes role="menu" with menuitem children', () => {
    wrap(
      <Menu
        aria-label="Actions"
        items={[
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
          { id: 'paste', label: 'Paste' },
        ]}
      />,
    );

    const menu = screen.getByRole('menu', { name: 'Actions' });
    expect(menu).toBeInTheDocument();
    expect(within(menu).getAllByRole('menuitem')).toHaveLength(3);
    expect(within(menu).getByRole('menuitem', { name: 'Cut' })).toBeInTheDocument();
    expect(within(menu).getByRole('menuitem', { name: 'Copy' })).toBeInTheDocument();
    expect(within(menu).getByRole('menuitem', { name: 'Paste' })).toBeInTheDocument();
  });

  it('moves active item with ArrowDown and ArrowUp', async () => {
    const user = userEvent.setup();
    wrap(
      <Menu
        aria-label="Actions"
        items={[
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
          { id: 'paste', label: 'Paste' },
        ]}
      />,
    );

    const menu = screen.getByRole('menu', { name: 'Actions' });
    menu.focus();

    expect(within(menu).getByRole('menuitem', { name: 'Cut' })).toHaveAttribute(
      'data-active',
      'true',
    );

    await user.keyboard('{ArrowDown}');
    expect(within(menu).getByRole('menuitem', { name: 'Copy' })).toHaveAttribute(
      'data-active',
      'true',
    );
    expect(within(menu).getByRole('menuitem', { name: 'Cut' })).not.toHaveAttribute(
      'data-active',
      'true',
    );

    await user.keyboard('{ArrowUp}');
    expect(within(menu).getByRole('menuitem', { name: 'Cut' })).toHaveAttribute(
      'data-active',
      'true',
    );
  });

  it('activates onSelect with Enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    wrap(
      <Menu
        aria-label="Actions"
        items={[
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy', onSelect },
          { id: 'paste', label: 'Paste' },
        ]}
      />,
    );

    const menu = screen.getByRole('menu', { name: 'Actions' });
    menu.focus();
    await user.keyboard('{ArrowDown}{Enter}');

    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
