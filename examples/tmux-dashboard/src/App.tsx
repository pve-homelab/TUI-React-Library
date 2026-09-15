import { useEffect, useState } from 'react';
import {
  Button,
  CommandPalette,
  KeyboardShortcutHint,
  List,
  ListItem,
  Pane,
  SessionBar,
  SplitPaneHorizontal,
  SplitPaneVertical,
  StatusBar,
  ThemeProvider,
  TuiFrame,
  type CommandItem,
} from 'tui-react-library';
import './styles.css';

const AGENTS = [
  { id: 'herdr', label: 'herdr', status: 'working', harness: 'claude' },
  { id: 'explore', label: 'explore', status: 'idle', harness: 'opencode' },
  { id: 'dash', label: 'web-dashboard', status: 'blocked', harness: 'claude' },
  { id: 'pipe', label: 'data-pipeline', status: 'done', harness: 'codex' },
] as const;

const GLYPH = {
  working: '●',
  idle: '○',
  blocked: '◉',
  done: '✔',
} as const;

const WINDOWS = [
  { id: '0', label: '0:zsh', log: '$ bun run dev\nVITE v6.3.1 ready in 412 ms\nLocal http://localhost:5173/' },
  { id: '1', label: '1:agent', log: '❯ finish the usage chart and ship it to staging\n● Wrote UsageChart.tsx\n● Typecheck clean.' },
  { id: '2', label: '2:logs', log: '02:30:18 WARN upstream throttled\n02:31:09 elapsed 6h 12m · 68% complete' },
];

export function App() {
  const [session, setSession] = useState('herdr');
  const [agent, setAgent] = useState<(typeof AGENTS)[number]['id']>('herdr');
  const [win, setWin] = useState('1');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const focused = AGENTS.find((item) => item.id === agent) ?? AGENTS[0];
  const activeWindow = WINDOWS.find((item) => item.id === win) ?? WINDOWS[1]!;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const commands: CommandItem[] = [
    {
      id: 'focus-herdr',
      label: 'Focus herdr',
      keywords: 'agent',
      onSelect: () => {
        setAgent('herdr');
        setSession('herdr');
        setLastCommand('Focus herdr');
        setPaletteOpen(false);
      },
    },
    {
      id: 'window-zsh',
      label: 'Switch to 0:zsh',
      keywords: 'window session',
      onSelect: () => {
        setWin('0');
        setLastCommand('Switch to 0:zsh');
        setPaletteOpen(false);
      },
    },
    {
      id: 'window-agent',
      label: 'Switch to 1:agent',
      keywords: 'window session',
      onSelect: () => {
        setWin('1');
        setLastCommand('Switch to 1:agent');
        setPaletteOpen(false);
      },
    },
    {
      id: 'window-logs',
      label: 'Switch to 2:logs',
      keywords: 'window session',
      onSelect: () => {
        setWin('2');
        setLastCommand('Switch to 2:logs');
        setPaletteOpen(false);
      },
    },
  ];

  return (
    <ThemeProvider
      theme="mocha"
      accent="blue"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <SessionBar
        sessions={WINDOWS.map((item) => ({
          id: item.id,
          label: item.label,
          active: item.id === win,
        }))}
        onSelect={setWin}
        trailing={
          <>
            <KeyboardShortcutHint keys={['C-b', '%']} label="vsplit" />
            <KeyboardShortcutHint keys={['C-b', '"']} label="hsplit" />
            <KeyboardShortcutHint keys={['C-k']} label="command" />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
            >
              ⌘K
            </Button>
            <span style={{ color: 'var(--tui-subtext0)', fontSize: 11 }}>{session}</span>
          </>
        }
      />
      <div style={{ flex: 1, minHeight: 0 }}>
        <SplitPaneHorizontal initialSizes={[22, 78]}>
          <Pane title="spaces" focused>
            <List>
              {AGENTS.map((item) => (
                <ListItem
                  key={item.id}
                  selected={item.id === agent}
                  leading={GLYPH[item.status]}
                  trailing={item.harness}
                  onClick={() => {
                    setAgent(item.id);
                    setSession(item.label);
                  }}
                >
                  {item.label}
                </ListItem>
              ))}
            </List>
          </Pane>
          <SplitPaneVertical initialSizes={[62, 38]}>
            <Pane
              title={`${focused.label} · ${focused.harness}`}
              focused
              headerActions={<span style={{ color: 'var(--tui-green)' }}>{focused.status}</span>}
            >
              <TuiFrame title={`pane 0 — ${activeWindow.label}`}>
                <pre className="term">{activeWindow.log}</pre>
                {lastCommand ? (
                  <pre className="term">{`\n# last command: ${lastCommand}`}</pre>
                ) : null}
              </TuiFrame>
            </Pane>
            <SplitPaneHorizontal initialSizes={[50, 50]}>
              <Pane title="shell">
                <pre className="term">{`$ bun run dev
$ node scripts/prepare-docs.mjs && astro dev
astro v5.18.1 ready in 668 ms`}</pre>
              </Pane>
              <Pane title="agent">
                <pre className="term">{`❯ make the herdr.dev hero mock look exactly like real claude code
● Ha. I read the real pane over the socket.
⠋ Baking… (13m 36s · esc to interrupt)`}</pre>
              </Pane>
            </SplitPaneHorizontal>
          </SplitPaneVertical>
        </SplitPaneHorizontal>
      </div>
      <StatusBar
        left={`[${session}] ${win}:${focused.label}`}
        center={`${focused.status} · ${focused.harness}`}
        right="C-k command · prefix C-b · % split · d detach"
      />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} items={commands} />
    </ThemeProvider>
  );
}
