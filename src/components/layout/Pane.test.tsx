import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../../theme';
import { Pane, SplitPaneHorizontal, SplitPaneVertical } from './Pane';

function wrap(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Pane', () => {
  it('renders title and body', () => {
    wrap(
      <Pane title="spaces" focused>
        body content
      </Pane>,
    );

    expect(screen.getByText('spaces')).toBeInTheDocument();
    expect(screen.getByText('body content')).toBeInTheDocument();
  });

  it('renders header actions', () => {
    wrap(
      <Pane title="agent" headerActions={<span>working</span>}>
        log
      </Pane>,
    );

    expect(screen.getByText('working')).toBeInTheDocument();
  });
});

describe('SplitPanes', () => {
  it('renders horizontal split with a separator', () => {
    wrap(
      <SplitPaneHorizontal>
        <Pane title="left">L</Pane>
        <Pane title="right">R</Pane>
      </SplitPaneHorizontal>,
    );

    expect(screen.getByText('left')).toBeInTheDocument();
    expect(screen.getByText('right')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('renders vertical split with a separator', () => {
    wrap(
      <SplitPaneVertical>
        <Pane title="top">T</Pane>
        <Pane title="bottom">B</Pane>
      </SplitPaneVertical>,
    );

    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
  });
});
