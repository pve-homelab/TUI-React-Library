import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../theme';
import { Toggle } from './Toggle';

function wrap(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Toggle', () => {
  it('exposes role="switch" and aria-checked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    wrap(<Toggle label="Notifications" defaultChecked={false} onChange={onChange} />);

    const control = screen.getByRole('switch', { name: 'Notifications' });
    expect(control).toHaveAttribute('aria-checked', 'false');

    await user.click(control);

    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
