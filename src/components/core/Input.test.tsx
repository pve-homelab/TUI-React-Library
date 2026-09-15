import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../theme';
import { Input, TextArea } from './Input';

function wrap(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Input', () => {
  it('calls onChange when the value changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    wrap(<Input aria-label="Search" onChange={onChange} />);

    await user.type(screen.getByRole('textbox', { name: 'Search' }), 'ab');

    expect(onChange).toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue('ab');
  });
});

describe('TextArea', () => {
  it('calls onChange when the value changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    wrap(<TextArea aria-label="Notes" onChange={onChange} />);

    await user.type(screen.getByRole('textbox', { name: 'Notes' }), 'hi');

    expect(onChange).toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue('hi');
  });
});
