import { describe, expect, it } from 'vitest';
import { applyCardMove, resolveDropTarget } from './reorder';
import type { KanbanCardData } from './types';

const cards: KanbanCardData[] = [
  { id: 'a', columnId: 'todo', title: 'A' },
  { id: 'b', columnId: 'todo', title: 'B' },
  { id: 'c', columnId: 'plan', title: 'C' },
];

describe('applyCardMove', () => {
  it('moves a card across columns', () => {
    const next = applyCardMove(cards, {
      cardId: 'a',
      fromColumnId: 'todo',
      toColumnId: 'plan',
      toIndex: 0,
    });
    expect(next.find((card) => card.id === 'a')?.columnId).toBe('plan');
    expect(next.filter((card) => card.columnId === 'plan').map((card) => card.id)).toEqual([
      'a',
      'c',
    ]);
  });

  it('reorders within a column', () => {
    const next = applyCardMove(cards, {
      cardId: 'a',
      fromColumnId: 'todo',
      toColumnId: 'todo',
      toIndex: 1,
    });
    expect(next.filter((card) => card.columnId === 'todo').map((card) => card.id)).toEqual([
      'b',
      'a',
    ]);
  });
});

describe('resolveDropTarget', () => {
  it('resolves column droppable ids to end index', () => {
    expect(resolveDropTarget(cards, ['todo', 'plan'], 'plan')).toEqual({
      columnId: 'plan',
      index: 1,
    });
  });

  it('resolves card ids to their column index', () => {
    expect(resolveDropTarget(cards, ['todo', 'plan'], 'b')).toEqual({
      columnId: 'todo',
      index: 1,
    });
  });
});
