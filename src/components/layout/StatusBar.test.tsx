import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../../theme';
import { StatusBar } from './StatusBar';

function wrap(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('StatusBar', () => {
  it('renders left, center, and right segments', () => {
    wrap(<StatusBar left="left-bit" center="center-bit" right="right-bit" />);

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('left-bit');
    expect(status).toHaveTextContent('center-bit');
    expect(status).toHaveTextContent('right-bit');
  });
});
