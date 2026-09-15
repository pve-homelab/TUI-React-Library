import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { applyCardMove } from './reorder';
import { KanbanBoard } from './KanbanBoard';
import type { KanbanCardData, KanbanColumnData } from './types';

const columns: KanbanColumnData[] = [
  { id: 'todo', title: 'Todo', subtitle: 'manual' },
  { id: 'plan', title: 'Plan', subtitle: 'auto' },
  { id: 'execute', title: 'Execute', subtitle: 'auto' },
];

const initialCards: KanbanCardData[] = [
  {
    id: 'c1',
    columnId: 'todo',
    title: 'Wire stories',
    description: 'Catch up Storybook coverage',
    status: 'working',
    tags: [{ id: 'docs', label: 'docs' }],
  },
  {
    id: 'c2',
    columnId: 'plan',
    title: 'Add smoke tests',
    description: 'Board render + keyboard shove',
    status: 'idle',
    tags: [{ id: 'test', label: 'test' }],
  },
  {
    id: 'c3',
    columnId: 'execute',
    title: 'Ship demo',
    description: 'examples/kanban-demo',
    status: 'blocked',
    tags: [{ id: 'demo', label: 'demo' }],
  },
];

const meta: Meta<typeof KanbanBoard> = {
  title: 'Kanban/KanbanBoard',
  component: KanbanBoard,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof KanbanBoard>;

export const Default: Story = {
  render: () => {
    const [cards, setCards] = useState(initialCards);
    const [selectedId, setSelectedId] = useState('c1');

    return (
      <div style={{ height: 420, padding: 8 }}>
        <KanbanBoard
          columns={columns}
          cards={cards}
          selectedCardId={selectedId}
          focusedColumnId={cards.find((card) => card.id === selectedId)?.columnId}
          onSelectCard={setSelectedId}
          onMove={(event) => {
            setCards((prev) => applyCardMove(prev, event));
            setSelectedId(event.cardId);
          }}
        />
      </div>
    );
  },
};

export const EmptyColumns: Story = {
  args: {
    columns: [
      { id: 'todo', title: 'Todo' },
      { id: 'done', title: 'Done' },
    ],
    cards: [],
  },
};
