import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../theme';
import { KanbanBoard } from './KanbanBoard';
import type { KanbanCardData, KanbanColumnData } from './types';

function wrap(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const columns: KanbanColumnData[] = [
  { id: 'todo', title: 'Todo', subtitle: 'manual' },
  { id: 'plan', title: 'Plan' },
];

const cards: KanbanCardData[] = [
  { id: 'a', columnId: 'todo', title: 'Card A', description: 'first card' },
  { id: 'b', columnId: 'plan', title: 'Card B' },
];

describe('KanbanBoard', () => {
  it('renders columns and cards (smoke)', () => {
    wrap(<KanbanBoard columns={columns} cards={cards} />);

    expect(screen.getByText('Todo')).toBeInTheDocument();
    expect(screen.getByText('Plan')).toBeInTheDocument();
    expect(screen.getByText('Card A')).toBeInTheDocument();
    expect(screen.getByText('Card B')).toBeInTheDocument();
    expect(screen.getByText('first card')).toBeInTheDocument();
  });

  it('calls onSelectCard when a card is clicked', async () => {
    const user = userEvent.setup();
    const onSelectCard = vi.fn();
    wrap(<KanbanBoard columns={columns} cards={cards} onSelectCard={onSelectCard} />);

    await user.click(screen.getByText('Card A'));
    expect(onSelectCard).toHaveBeenCalledWith('a');
  });
});
