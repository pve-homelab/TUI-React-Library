import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useKeyboardNav } from '../../hooks';
import { ThemeProvider } from '../../theme';
import { List, ListItem } from './List';

function wrap(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const labels = ['Alpha', 'Beta', 'Gamma'];

function NavList({ onSelect }: { onSelect?: (index: number) => void }) {
  const [selected, setSelected] = useState(0);
  const { activeIndex, onKeyDown } = useKeyboardNav({
    count: labels.length,
    onSelect: (index) => {
      setSelected(index);
      onSelect?.(index);
    },
  });

  return (
    <List tabIndex={0} onKeyDown={onKeyDown} aria-label="Agents">
      {labels.map((label, index) => (
        <ListItem key={label} selected={index === selected} focused={index === activeIndex}>
          {label}
        </ListItem>
      ))}
    </List>
  );
}

describe('List', () => {
  it('renders listbox options', () => {
    wrap(
      <List>
        <ListItem selected>Alpha</ListItem>
        <ListItem>Beta</ListItem>
      </List>,
    );

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'Beta' })).toHaveAttribute('aria-selected', 'false');
  });

  it('moves focus with ArrowDown and selects with Enter via useKeyboardNav', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    wrap(<NavList onSelect={onSelect} />);

    const list = screen.getByRole('listbox', { name: 'Agents' });
    list.focus();
    await user.keyboard('{ArrowDown}{Enter}');

    expect(onSelect).toHaveBeenCalledWith(1);
    expect(screen.getByRole('option', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true');
  });
});
