import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { applyCardMove } from './reorder';
import { KanbanBoard } from './KanbanBoard';
import { KanbanSwimlane } from './KanbanSwimlane';
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
    title: 'Wire swimlanes',
    description: 'Group columns under a lane title',
    status: 'idle',
    tags: [{ id: 'ui', label: 'ui' }],
  },
  {
    id: 'c2',
    columnId: 'plan',
    title: 'Harden cross-column DnD',
    description: 'Pointer-first collision detection',
    status: 'working',
    tags: [{ id: 'dnd', label: 'dnd' }],
  },
  {
    id: 'c3',
    columnId: 'execute',
    title: 'Ship demo board',
    description: 'Drag cards across columns smoothly',
    status: 'blocked',
    tags: [{ id: 'demo', label: 'demo' }],
  },
];

const meta: Meta<typeof KanbanSwimlane> = {
  title: 'Kanban/KanbanSwimlane',
  component: KanbanSwimlane,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof KanbanSwimlane>;

function DefaultStory() {
  const [cards, setCards] = useState(initialCards);
  const [selectedId, setSelectedId] = useState('c1');

  return (
    <div style={{ height: 420, display: 'flex', flexDirection: 'column' }}>
      <KanbanSwimlane title="Delivery" subtitle="drag across columns · H/L shove">
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
      </KanbanSwimlane>
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultStory />,
};

export const StackedLanes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
      <KanbanSwimlane title="Frontend" subtitle="UI surfaces">
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ minWidth: 160, border: '1px solid var(--tui-border)', padding: 8 }}>
            Todo
          </div>
          <div style={{ minWidth: 160, border: '1px solid var(--tui-border)', padding: 8 }}>
            Review
          </div>
        </div>
      </KanbanSwimlane>
      <KanbanSwimlane title="Backend" subtitle="services">
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ minWidth: 160, border: '1px solid var(--tui-border)', padding: 8 }}>
            Plan
          </div>
          <div style={{ minWidth: 160, border: '1px solid var(--tui-border)', padding: 8 }}>
            Execute
          </div>
        </div>
      </KanbanSwimlane>
    </div>
  ),
};
