import {
  closestCorners,
  pointerWithin,
  type CollisionDetection,
  type Collision,
  type DroppableContainer,
} from '@dnd-kit/core';

function droppableType(container: DroppableContainer | undefined): string | undefined {
  const type = container?.data.current?.type;
  return typeof type === 'string' ? type : undefined;
}

function droppableColumnId(container: DroppableContainer | undefined): string | undefined {
  const columnId = container?.data.current?.columnId;
  return typeof columnId === 'string' ? columnId : undefined;
}

function findDroppable(
  containers: DroppableContainer[],
  id: Collision['id'],
): DroppableContainer | undefined {
  return containers.find((droppable) => droppable.id === id);
}

/**
 * Prefer droppables under the pointer so cross-column drags track the cursor
 * instead of sticking to same-row cards via closestCorners alone.
 *
 * - Pointer hits: cards in a hit column win for insertion; a dest column under
 *   the pointer beats a foreign (source) same-row card.
 * - Empty pointer: nearest **column** droppable (not same-row cards).
 */
export const kanbanCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);

  if (pointerCollisions.length === 0) {
    const columnContainers = args.droppableContainers.filter(
      (container) => droppableType(container) === 'column',
    );
    if (columnContainers.length > 0) {
      const columnCollisions = closestCorners({
        ...args,
        droppableContainers: columnContainers,
      });
      if (columnCollisions.length > 0) {
        return columnCollisions;
      }
    }
    return closestCorners(args);
  }

  const columnCollisions = pointerCollisions.filter(
    (collision) =>
      droppableType(findDroppable(args.droppableContainers, collision.id)) === 'column',
  );
  const cardCollisions = pointerCollisions.filter(
    (collision) =>
      droppableType(findDroppable(args.droppableContainers, collision.id)) === 'card',
  );

  const hitColumnIds = new Set(
    columnCollisions
      .map((collision) =>
        droppableColumnId(findDroppable(args.droppableContainers, collision.id)),
      )
      .filter((columnId): columnId is string => Boolean(columnId)),
  );

  const cardsInHitColumns = cardCollisions.filter((collision) => {
    if (hitColumnIds.size === 0) return true;
    const columnId = droppableColumnId(
      findDroppable(args.droppableContainers, collision.id),
    );
    return columnId !== undefined && hitColumnIds.has(columnId);
  });

  if (cardsInHitColumns.length > 0) {
    return cardsInHitColumns;
  }
  if (columnCollisions.length > 0) {
    return columnCollisions;
  }
  return pointerCollisions;
};
