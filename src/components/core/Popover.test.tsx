import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../theme';
import { Popover } from './Popover';

function wrap(ui: ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Popover', () => {
  it('toggles content on trigger click', async () => {
    const user = userEvent.setup();
    wrap(
      <Popover content={<div>Popover body</div>}>
        <button type="button">Open</button>
      </Popover>,
    );

    expect(screen.queryByText('Popover body')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Popover body')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    wrap(
      <Popover defaultOpen content={<div>Esc me</div>}>
        <button type="button">Trigger</button>
      </Popover>,
    );

    expect(screen.getByText('Esc me')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByText('Esc me')).not.toBeInTheDocument();
  });

  it('supports controlled open via onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Popover
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
          content={<div>Controlled</div>}
        >
          <button type="button">Ctrl</button>
        </Popover>
      );
    }

    wrap(<Controlled />);

    await user.click(screen.getByRole('button', { name: 'Ctrl' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByText('Controlled')).toBeInTheDocument();
  });
});
