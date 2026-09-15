import {
  closestCorners,
  pointerWithin,
  type CollisionDetection,
} from '@dnd-kit/core';

/**
 * Prefer droppables under the pointer so cross-column drags track the cursor
 * instead of sticking to same-row cards via closestCorners alone.
 */
export const kanbanCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length === 0) {
    return closestCorners(args);
  }

  const cardCollisions = pointerCollisions.filter((collision) => {
    const container = args.droppableContainers.find(
      (droppable) => droppable.id === collision.id,
    );
    return container?.data.current?.type === 'card';
  });

  return cardCollisions.length > 0 ? cardCollisions : pointerCollisions;
};
