import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../theme';
import { Radio, RadioGroup } from './Radio';

function wrap(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Radio / RadioGroup', () => {
  it('selects a value on click and moves selection with arrow keys', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    wrap(
      <RadioGroup name="size" defaultValue="sm" onChange={onChange}>
        <Radio value="sm">Small</Radio>
        <Radio value="md">Medium</Radio>
        <Radio value="lg">Large</Radio>
      </RadioGroup>,
    );

    const small = screen.getByRole('radio', { name: 'Small' });
    const medium = screen.getByRole('radio', { name: 'Medium' });
    const large = screen.getByRole('radio', { name: 'Large' });

    expect(small).toBeChecked();
    expect(medium).not.toBeChecked();

    await user.click(medium);
    expect(medium).toBeChecked();
    expect(onChange).toHaveBeenCalledWith('md');

    medium.focus();
    await user.keyboard('{ArrowDown}');
    expect(large).toBeChecked();
    expect(onChange).toHaveBeenCalledWith('lg');

    await user.keyboard('{ArrowUp}');
    expect(medium).toBeChecked();
    expect(onChange).toHaveBeenCalledWith('md');
  });
});
