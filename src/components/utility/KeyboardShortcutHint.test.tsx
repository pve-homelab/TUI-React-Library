import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../../theme';
import { KeyboardShortcutHint } from './KeyboardShortcutHint';

function wrap(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('KeyboardShortcutHint', () => {
  it('renders key chords and optional label', () => {
    wrap(<KeyboardShortcutHint keys={['C-b', '%']} label="vsplit" />);

    expect(screen.getByText('C-b')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
    expect(screen.getByText('vsplit')).toBeInTheDocument();
  });

  it('omits label when not provided', () => {
    wrap(<KeyboardShortcutHint keys={['Esc']} />);

    expect(screen.getByText('Esc')).toBeInTheDocument();
    expect(screen.queryByText('vsplit')).not.toBeInTheDocument();
  });
});
