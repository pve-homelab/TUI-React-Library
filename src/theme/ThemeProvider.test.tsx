import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeProvider';

function Probe() {
  const { themeName, accent } = useTheme();
  return (
    <span>
      {themeName}:{accent}
    </span>
  );
}

describe('ThemeProvider', () => {
  it('provides theme tokens to descendants (smoke)', () => {
    render(
      <ThemeProvider theme="mocha" accent="mauve">
        <Probe />
      </ThemeProvider>,
    );

    expect(screen.getByText('mocha:mauve')).toBeInTheDocument();
    expect(document.querySelector('[data-tui-theme="mocha"]')).toBeTruthy();
  });

  it('throws when useTheme is used outside a provider', () => {
    expect(() => render(<Probe />)).toThrow(/useTheme must be used within a ThemeProvider/);
  });
});
