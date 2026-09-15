# tui-react-library

Production-grade React TUI component library inspired by [herdr.dev](https://herdr.dev), [herdr-board](https://github.com/nelsonPires5/herdr-board), and [tmux](https://tmux.app/).

Catppuccin-inspired tokens, keyboard-first controls, split panes, status/session bars, and a Kanban board with drag-and-drop.

## Status

Early scaffold. Design docs live in [`docs/architecture.md`](docs/architecture.md).

Runnable apps:

- [`examples/kanban-demo`](examples/kanban-demo) — herdr-board style Kanban
- [`examples/tmux-dashboard`](examples/tmux-dashboard) — tmux split panes + session/status bars

## Install

```bash
npm install tui-react-library
```

Peer deps: `react` and `react-dom` (^18.2 || ^19).

```tsx
import { ThemeProvider, Pane, StatusBar, KanbanBoard } from 'tui-react-library';
import 'tui-react-library/styles.css';

export function App() {
  return (
    <ThemeProvider theme="mocha" accent="blue">
      {/* your TUI */}
    </ThemeProvider>
  );
}
```

## Development

```bash
npm install
npm run build
npm test
npm run storybook
```

### Examples

```bash
npm run examples:kanban   # herdr-board style Kanban demo
npm run examples:tmux     # tmux-style split-pane dashboard
```

## Theming

Wrap your app in `ThemeProvider`:

| Prop | Values | Default |
|------|--------|---------|
| `theme` | `mocha` (dark), `latte` (light) | `mocha` |
| `accent` | `blue`, `teal`, `mauve`, `peach`, `green` | `blue` |

Tokens are CSS variables (`--tui-bg`, `--tui-accent`, …) scoped to the provider root.

## Component map

- **Layout** — `Pane`, `SplitPaneHorizontal`, `SplitPaneVertical`, `StatusBar`, `SessionBar` / `TabBar`, `TuiFrame`
- **Core** — `Button`, `Input`, `List`, `Modal`, `CommandPalette`, …
- **Kanban** — `KanbanBoard`, `KanbanColumn`, `KanbanCard`
- **Utility** — `KeyboardShortcutHint`, `Toast`, `Skeleton`, …

See [`docs/architecture.md`](docs/architecture.md) for the full taxonomy.

## License

MIT
