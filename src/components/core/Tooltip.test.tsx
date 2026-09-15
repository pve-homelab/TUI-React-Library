import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../../theme';
import { Tooltip } from './Tooltip';

function wrap(ui: ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Tooltip', () => {
  it('shows on hover and hides on leave', async () => {
    const user = userEvent.setup();
    wrap(
      <Tooltip content="Hover tip">
        <button type="button">Target</button>
      </Tooltip>,
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.hover(screen.getByRole('button', { name: 'Target' }));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Hover tip');

    await user.unhover(screen.getByRole('button', { name: 'Target' }));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows on focus and hides on blur', async () => {
    const user = userEvent.setup();
    wrap(
      <>
        <Tooltip content="Focus tip">
          <button type="button">Focusable</button>
        </Tooltip>
        <button type="button">Other</button>
      </>,
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Focusable' })).toHaveFocus();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Focus tip');

    await user.tab();
    expect(screen.getByRole('button', { name: 'Other' })).toHaveFocus();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('does not stick open after click once focus moves away', async () => {
    const user = userEvent.setup();
    wrap(
      <>
        <Tooltip content="No sticky">
          <button type="button">Click me</button>
        </Tooltip>
        <button type="button">Other</button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Click me' }));
    // Click focuses the trigger, so tooltip may show via focus — not via sticky click mode
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Other' }));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
