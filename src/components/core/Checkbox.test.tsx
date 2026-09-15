import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../theme';
import { Checkbox } from './Checkbox';

function wrap(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Checkbox', () => {
  it('toggles on click and calls onChange(true)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    wrap(<Checkbox label="Accept" onChange={onChange} />);

    const input = screen.getByRole('checkbox', { name: 'Accept' });
    expect(input).not.toBeChecked();

    await user.click(input);

    expect(input).toBeChecked();
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('supports indeterminate via the input property', () => {
    wrap(<Checkbox label="Partial" indeterminate />);
    const input = screen.getByRole('checkbox', { name: 'Partial' }) as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
  });
});
