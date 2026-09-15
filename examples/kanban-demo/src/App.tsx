import { useMemo, useState } from 'react';
import {
  Button,
  Input,
  KanbanBoard,
  KeyboardShortcutHint,
  SessionBar,
  StatusBar,
  ThemeProvider,
  applyCardMove,
  type KanbanCardData,
  type KanbanColumnData,
} from 'tui-react-library';
import './styles.css';

const COLUMNS: KanbanColumnData[] = [
  { id: 'todo', title: 'Todo', subtitle: 'manual gate', trigger: 'manual' },
  { id: 'plan', title: 'Plan', subtitle: 'automatic', trigger: 'automatic' },
  { id: 'execute', title: 'Execute', subtitle: 'automatic', trigger: 'automatic' },
  { id: 'review', title: 'Review', subtitle: 'human gate', trigger: 'manual' },
];

const INITIAL_CARDS: KanbanCardData[] = [
  {
    id: 'c1',
    columnId: 'todo',
    title: 'Usage chart empty state',
    description: 'Ship stacked area + tooltip for staging.',
    status: 'idle',
    tags: [{ id: 'claude', label: 'claude' }],
    meta: 'effort:high',
  },
  {
    id: 'c2',
    columnId: 'plan',
    title: 'Backfill events v2',
    description: 'Resume from last committed offset.',
    status: 'working',
    tags: [{ id: 'codex', label: 'codex' }],
    meta: '6h elapsed',
  },
  {
    id: 'c3',
    columnId: 'execute',
    title: 'herdr.dev hero mock',
    description: 'Match real Claude Code pane chrome.',
    status: 'blocked',
    tags: [{ id: 'opencode', label: 'opencode' }],
    meta: 'needs confirm',
  },
  {
    id: 'c4',
    columnId: 'review',
    title: 'Retry uploader PUTs',
    description: '3x backoff + unit test in src/upload.rs',
    status: 'done',
    tags: [{ id: 'pi', label: 'pi' }],
    meta: 'awaiting',
  },
];

export function App() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [selectedId, setSelectedId] = useState('c1');
  const [query, setQuery] = useState('');
  const [board, setBoard] = useState('main');

  const visible = useMemo(
    () =>
      cards.filter(
        (card) =>
          !query ||
          card.title.toLowerCase().includes(query.toLowerCase()) ||
          card.description?.toLowerCase().includes(query.toLowerCase()),
      ),
    [cards, query],
  );

  const selected = cards.find((card) => card.id === selectedId);

  return (
    <ThemeProvider
      theme="mocha"
      accent="blue"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <SessionBar
        sessions={[
          { id: 'main', label: 'herdr-board', active: board === 'main', badge: '4' },
          { id: 'infra', label: 'infra', active: board === 'infra', badge: '0' },
        ]}
        onSelect={setBoard}
        trailing={
          <>
            <KeyboardShortcutHint keys={['n']} label="new" />
            <KeyboardShortcutHint keys={['H', 'L']} label="move" />
            <KeyboardShortcutHint keys={['Enter']} label="detail" />
          </>
        }
      />
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: 8,
          borderBottom: '1px solid var(--tui-border)',
          alignItems: 'center',
        }}
      >
        <Input
          placeholder="filter cards…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          style={{ maxWidth: 280 }}
        />
        <Button
          size="sm"
          onClick={() => {
            const id = `c${Date.now()}`;
            setCards((prev) => [
              {
                id,
                columnId: 'todo',
                title: 'New prompt',
                description: 'Dispatched agent card',
                status: 'idle',
                tags: [{ id: 'pi', label: 'pi' }],
              },
              ...prev,
            ]);
            setSelectedId(id);
          }}
        >
          n new card
        </Button>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 280px' }}>
        <KanbanBoard
          columns={COLUMNS}
          cards={visible}
          selectedCardId={selectedId}
          focusedColumnId={selected?.columnId}
          onSelectCard={setSelectedId}
          onMove={(event) => {
            setCards((prev) => applyCardMove(prev, event));
            setSelectedId(event.cardId);
          }}
        />
        <aside
          style={{
            borderLeft: '1px solid var(--tui-border)',
            padding: 12,
            overflow: 'auto',
            fontSize: 12,
          }}
        >
          <div style={{ color: 'var(--tui-accent)', marginBottom: 8 }}>card detail</div>
          {selected ? (
            <>
              <h2 style={{ margin: '0 0 8px', fontSize: 14 }}>{selected.title}</h2>
              <p style={{ color: 'var(--tui-subtext1)' }}>{selected.description}</p>
              <p style={{ color: 'var(--tui-subtext0)' }}>
                {selected.status} · {selected.columnId}
              </p>
            </>
          ) : (
            <p style={{ color: 'var(--tui-subtext0)' }}>Select a card</p>
          )}
        </aside>
      </div>
      <StatusBar
        left={`board ${board}`}
        center={`${visible.length} cards`}
        right="H/L shove · drag to move · ? help"
      />
    </ThemeProvider>
  );
}
