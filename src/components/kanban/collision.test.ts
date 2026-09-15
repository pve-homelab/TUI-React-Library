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

const baseArgs = {
  active: { id: 'a' },
  collisionRect: { top: 0, left: 0, bottom: 10, right: 10, width: 10, height: 10 },
  droppableRects: new Map(),
  pointerCoordinates: { x: 5, y: 5 },
  droppableContainers: [
    {
      id: 'todo',
      key: 'todo',
      data: { current: { type: 'column', columnId: 'todo' } },
      rect: { current: null },
      node: { current: null },
    },
    {
      id: 'card-b',
      key: 'card-b',
      data: { current: { type: 'card', columnId: 'plan' } },
      rect: { current: null },
      node: { current: null },
    },
  ],
} as never;

describe('kanbanCollisionDetection', () => {
  beforeEach(() => {
    pointerWithin.mockReset();
    closestCorners.mockReset();
  });

  it('falls back to closestCorners when the pointer hits nothing', () => {
    pointerWithin.mockReturnValue([]);
    closestCorners.mockReturnValue([{ id: 'todo' }]);

    expect(kanbanCollisionDetection(baseArgs)).toEqual([{ id: 'todo' }]);
    expect(closestCorners).toHaveBeenCalledOnce();
  });

  it('returns pointer hits when present', () => {
    pointerWithin.mockReturnValue([{ id: 'todo' }]);
    closestCorners.mockReturnValue([{ id: 'card-b' }]);

    expect(kanbanCollisionDetection(baseArgs)).toEqual([{ id: 'todo' }]);
    expect(closestCorners).not.toHaveBeenCalled();
  });

  it('prefers card droppables when both column and card are under the pointer', () => {
    pointerWithin.mockReturnValue([{ id: 'todo' }, { id: 'card-b' }]);

    expect(kanbanCollisionDetection(baseArgs)).toEqual([{ id: 'card-b' }]);
    expect(closestCorners).not.toHaveBeenCalled();
  });
});
