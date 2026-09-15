import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScrollableContainer } from './ScrollableContainer';

describe('ScrollableContainer', () => {
  it('applies maxHeight style', () => {
    render(
      <ScrollableContainer maxHeight="12rem" data-testid="scroll">
        content
      </ScrollableContainer>,
    );
    expect(screen.getByTestId('scroll')).toHaveStyle({ maxHeight: '12rem' });
  });

  it('renders children', () => {
    render(<ScrollableContainer>scroll body</ScrollableContainer>);
    expect(screen.getByText('scroll body')).toBeInTheDocument();
  });
});
