import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../theme';
import { Dropdown, Select } from './Select';

const options = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta' },
  { value: 'gamma', label: 'Gamma' },
];

function wrap(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Select', () => {
  it('opens listbox on click', async () => {
    const user = userEvent.setup();
    wrap(<Select options={options} placeholder="Pick one" />);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Pick one' }));

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Alpha' })).toBeInTheDocument();
  });

  it('selects with ArrowDown then Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    wrap(<Select options={options} placeholder="Pick one" onChange={onChange} />);

    const trigger = screen.getByRole('button', { name: 'Pick one' });
    await user.click(trigger);
    await user.keyboard('{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenCalledWith('beta');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Beta' })).toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    wrap(<Select options={options} placeholder="Pick one" />);

    await user.click(screen.getByRole('button', { name: 'Pick one' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('skips disabled options with ArrowDown', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    wrap(
      <Select
        options={[
          { value: 'alpha', label: 'Alpha' },
          { value: 'beta', label: 'Beta', disabled: true },
          { value: 'gamma', label: 'Gamma' },
        ]}
        placeholder="Pick one"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Pick one' }));
    await user.keyboard('{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenCalledWith('gamma');
  });

  it('Dropdown is an alias of Select', () => {
    expect(Dropdown).toBe(Select);
  });
});
