import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../theme';
import { CommandPalette, type CommandItem } from './CommandPalette';

function wrap(ui: ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const items: CommandItem[] = [
  { id: 'new', label: 'New file' },
  { id: 'open', label: 'Open file', keywords: 'browse load' },
  { id: 'save', label: 'Save' },
  { id: 'quit', label: 'Quit' },
];

function ControlledPalette({
  onClose = vi.fn(),
  commandItems = items,
}: {
  onClose?: () => void;
  commandItems?: CommandItem[];
}) {
  const [open, setOpen] = useState(true);
  return (
    <CommandPalette
      open={open}
      onClose={() => {
        setOpen(false);
        onClose();
      }}
      items={commandItems}
    />
  );
}

describe('CommandPalette', () => {
  it('filters items by query against label and keywords', async () => {
    const user = userEvent.setup();
    wrap(<CommandPalette open onClose={() => {}} items={items} />);

    const dialog = screen.getByRole('dialog');
    const list = within(dialog).getByRole('listbox');
    expect(within(list).getAllByRole('option')).toHaveLength(4);

    const input = within(dialog).getByRole('textbox');
    await user.type(input, 'browse');

    const filtered = within(list).getAllByRole('option');
    expect(filtered).toHaveLength(1);
    expect(filtered[0]).toHaveTextContent('Open file');
  });

  it('moves highlight with Arrow keys and activates onSelect with Enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    wrap(
      <CommandPalette
        open
        onClose={() => {}}
        items={[
          { id: 'new', label: 'New file' },
          { id: 'open', label: 'Open file', onSelect },
          { id: 'save', label: 'Save' },
        ]}
      />,
    );

    const dialog = screen.getByRole('dialog');
    const input = within(dialog).getByRole('textbox');
    input.focus();

    const options = within(dialog).getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowDown}');
    expect(within(dialog).getByRole('option', { name: 'Open file' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('Escape closes via Modal onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    wrap(<ControlledPalette onClose={onClose} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
