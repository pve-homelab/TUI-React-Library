import type { KanbanCardData, KanbanMoveEvent } from './types';

export function getCardColumnId(cards: KanbanCardData[], cardId: string): string | undefined {
  return cards.find((card) => card.id === cardId)?.columnId;
}

export function getCardsInColumn(cards: KanbanCardData[], columnId: string): KanbanCardData[] {
  return cards.filter((card) => card.columnId === columnId);
}

/** Move a card into a column at an index. Column membership is what matters for rendering. */
export function applyCardMove(cards: KanbanCardData[], event: KanbanMoveEvent): KanbanCardData[] {
  const moving = cards.find((card) => card.id === event.cardId);
  if (!moving) return cards;

  const without = cards.filter((card) => card.id !== event.cardId);
  const updated: KanbanCardData = { ...moving, columnId: event.toColumnId };
  const destination = without.filter((card) => card.columnId === event.toColumnId);
  const others = without.filter((card) => card.columnId !== event.toColumnId);
  const nextColumn = [...destination];
  const clampedIndex = Math.max(0, Math.min(event.toIndex, nextColumn.length));
  nextColumn.splice(clampedIndex, 0, updated);
  return [...others, ...nextColumn];
}

export function resolveDropTarget(
  cards: KanbanCardData[],
  columnIds: string[],
  overId: string,
): { columnId: string; index: number } | null {
  if (columnIds.includes(overId)) {
    return {
      columnId: overId,
      index: getCardsInColumn(cards, overId).length,
    };
  }

  const overCard = cards.find((card) => card.id === overId);
  if (!overCard) return null;

  const columnCards = getCardsInColumn(cards, overCard.columnId);
  const index = columnCards.findIndex((card) => card.id === overId);
  return {
    columnId: overCard.columnId,
    index: index < 0 ? columnCards.length : index,
  };
}
