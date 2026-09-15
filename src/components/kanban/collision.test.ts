import { beforeEach, describe, expect, it, vi } from 'vitest';

const pointerWithin = vi.hoisted(() => vi.fn());
const closestCorners = vi.hoisted(() => vi.fn());

vi.mock('@dnd-kit/core', async () => {
  const actual = await vi.importActual<typeof import('@dnd-kit/core')>('@dnd-kit/core');
  return {
    ...actual,
    pointerWithin: (...args: unknown[]) => pointerWithin(...args),
    closestCorners: (...args: unknown[]) => closestCorners(...args),
  };
});

import { kanbanCollisionDetection } from './collision';

const sourceSameRowCard = {
  id: 'card-source-row',
  key: 'card-source-row',
  data: { current: { type: 'card', columnId: 'plan' } },
  rect: { current: null },
  node: { current: null },
};

const destColumn = {
  id: 'todo',
  key: 'todo',
  data: { current: { type: 'column', columnId: 'todo' } },
  rect: { current: null },
  node: { current: null },
};

const destCard = {
  id: 'card-b',
  key: 'card-b',
  data: { current: { type: 'card', columnId: 'todo' } },
  rect: { current: null },
  node: { current: null },
};

const sourceColumn = {
  id: 'plan',
  key: 'plan',
  data: { current: { type: 'column', columnId: 'plan' } },
  rect: { current: null },
  node: { current: null },
};

const baseArgs = {
  active: { id: 'dragged' },
  collisionRect: { top: 0, left: 0, bottom: 10, right: 10, width: 10, height: 10 },
  droppableRects: new Map(),
  pointerCoordinates: { x: 5, y: 5 },
  droppableContainers: [destColumn, sourceColumn, sourceSameRowCard, destCard],
} as never;

describe('kanbanCollisionDetection', () => {
  beforeEach(() => {
    pointerWithin.mockReset();
    closestCorners.mockReset();
  });

  it('when pointerWithin is empty, prefers nearest column over same-row cards', () => {
    pointerWithin.mockReturnValue([]);
    closestCorners.mockImplementation((args: { droppableContainers: { id: string }[] }) => {
      const ids = args.droppableContainers.map((container) => String(container.id));
      if (ids.includes('card-source-row')) {
        return [{ id: 'card-source-row' }];
      }
      return [{ id: 'todo' }];
    });

    expect(kanbanCollisionDetection(baseArgs)).toEqual([{ id: 'todo' }]);
    expect(closestCorners).toHaveBeenCalled();
    const firstCallArgs = closestCorners.mock.calls[0]?.[0] as {
      droppableContainers: { id: string; data: { current?: { type?: string } } }[];
    };
    expect(
      firstCallArgs.droppableContainers.every(
        (container) => container.data.current?.type === 'column',
      ),
    ).toBe(true);
    expect(firstCallArgs.droppableContainers.map((c) => c.id)).not.toContain('card-source-row');
  });

  it('pointer over dest column wins over source same-row card', () => {
    // Dest column under pointer; closestCorners would stick to source same-row card.
    pointerWithin.mockReturnValue([{ id: 'todo' }]);
    closestCorners.mockReturnValue([{ id: 'card-source-row' }]);

    expect(kanbanCollisionDetection(baseArgs)).toEqual([{ id: 'todo' }]);
    expect(closestCorners).not.toHaveBeenCalled();
  });

  it('pointer over dest column wins even if source same-row card is also reported', () => {
    pointerWithin.mockReturnValue([{ id: 'todo' }, { id: 'card-source-row' }]);
    closestCorners.mockReturnValue([{ id: 'card-source-row' }]);

    expect(kanbanCollisionDetection(baseArgs)).toEqual([{ id: 'todo' }]);
    expect(closestCorners).not.toHaveBeenCalled();
  });

  it('prefers dest card over dest column when both are under the pointer', () => {
    pointerWithin.mockReturnValue([{ id: 'todo' }, { id: 'card-b' }]);

    expect(kanbanCollisionDetection(baseArgs)).toEqual([{ id: 'card-b' }]);
    expect(closestCorners).not.toHaveBeenCalled();
  });
});
