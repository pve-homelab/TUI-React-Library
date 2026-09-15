import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../../theme';
import { TuiFrame, TuiWindow } from '../../index';

function wrap(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('TuiFrame', () => {
  it('renders ReactNode title', () => {
    wrap(<TuiFrame title={<span>Title Node</span>}>body</TuiFrame>);
    expect(screen.getByText('Title Node')).toBeInTheDocument();
  });

  it('TuiWindow is an alias of TuiFrame', () => {
    expect(TuiWindow).toBe(TuiFrame);
  });
});
