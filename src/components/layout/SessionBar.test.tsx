import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../theme';
import { IconButton, SessionBar, TabBar } from './SessionBar';

function wrap(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const sessions = [
  { id: '0', label: '0:zsh', active: true },
  { id: '1', label: '1:agent', badge: 3 },
  { id: '2', label: '2:logs' },
];

describe('SessionBar', () => {
  it('calls onSelect with the clicked tab id', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    wrap(<SessionBar sessions={sessions} onSelect={onSelect} />);

    await user.click(screen.getByRole('tab', { name: /1:agent/ }));
    expect(onSelect).toHaveBeenCalledWith('1');
  });

  it('marks the active tab as selected', () => {
    wrap(<SessionBar sessions={sessions} />);

    expect(screen.getByRole('tab', { name: '0:zsh' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /1:agent/ })).toHaveAttribute('aria-selected', 'false');
  });

  it('TabBar is an alias of SessionBar', () => {
    expect(TabBar).toBe(SessionBar);
  });
});

describe('IconButton', () => {
  it('exposes an accessible name via label', () => {
    wrap(<IconButton label="New session">+</IconButton>);
    expect(screen.getByRole('button', { name: 'New session' })).toBeInTheDocument();
  });
});
