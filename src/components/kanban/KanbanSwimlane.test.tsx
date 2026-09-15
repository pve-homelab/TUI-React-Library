import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../theme';
import { KanbanBoard } from './KanbanBoard';
import { KanbanSwimlane } from './KanbanSwimlane';
import { applyCardMove } from './reorder';
import type { KanbanCardData, KanbanColumnData, KanbanMoveEvent } from './types';

function wrap(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const columns: KanbanColumnData[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'plan', title: 'Plan' },
];

const initialCards: KanbanCardData[] = [
  { id: 'a', columnId: 'todo', title: 'Card A' },
  { id: 'b', columnId: 'plan', title: 'Card B' },
];

describe('KanbanSwimlane', () => {
  it('renders title and children', () => {
    wrap(
      <KanbanSwimlane title="Agents">
        <div>lane body</div>
      </KanbanSwimlane>,
    );

    expect(screen.getByText('Agents')).toBeInTheDocument();
    expect(screen.getByText('lane body')).toBeInTheDocument();
  });

  it('renders optional subtitle', () => {
    wrap(
      <KanbanSwimlane title="Agents" subtitle="by owner">
        <div>lane body</div>
      </KanbanSwimlane>,
    );

    expect(screen.getByText('by owner')).toBeInTheDocument();
  });
});

describe('KanbanBoard cross-column moves', () => {
  it('applies cross-column moves via applyCardMove', () => {
    const next = applyCardMove(initialCards, {
      cardId: 'a',
      fromColumnId: 'todo',
      toColumnId: 'plan',
      toIndex: 0,
    });

    expect(next.find((card) => card.id === 'a')?.columnId).toBe('plan');
    expect(next.filter((card) => card.columnId === 'plan').map((card) => card.id)).toEqual([
      'a',
      'b',
    ]);
  });

  it('fires onMove when keyboard H/L shoves a card across columns', async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();

    function BoardHarness() {
      const [cards, setCards] = useState(initialCards);
      return (
        <KanbanBoard
          columns={columns}
          cards={cards}
          selectedCardId="a"
          onMove={(event: KanbanMoveEvent) => {
            onMove(event);
            setCards((prev) => applyCardMove(prev, event));
          }}
        />
      );
    }

    wrap(<BoardHarness />);

    const board = screen.getByText('Todo').closest('[tabindex="0"]');
    expect(board).toBeTruthy();
    (board as HTMLElement).focus();
    await user.keyboard('L');

    expect(onMove).toHaveBeenCalledWith({
      cardId: 'a',
      fromColumnId: 'todo',
      toColumnId: 'plan',
      toIndex: 1,
    });
  });
});
