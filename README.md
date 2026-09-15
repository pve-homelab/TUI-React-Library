# tui-react-library

Production-ready React TUI component library inspired by [herdr.dev](https://herdr.dev), [herdr-board](https://github.com/nelsonPires5/herdr-board), and [tmux](https://tmux.app/).

Catppuccin-inspired tokens, keyboard-first controls, split panes, status/session bars, overlays (Modal, Menu, CommandPalette, …), and a Kanban board with seamless cross-column drag-and-drop.

## Status

**v1.0.0 — production.** Full taxonomy shipped. Design notes: [`docs/architecture.md`](docs/architecture.md). Usage guide: [`docs/summary.md`](docs/summary.md).

Runnable apps:

- [`examples/kanban-demo`](examples/kanban-demo) — herdr-board style Kanban
- [`examples/tmux-dashboard`](examples/tmux-dashboard) — tmux splits + session/status bars + CommandPalette

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

- **Layout** — `Pane`, `SplitPaneHorizontal`, `SplitPaneVertical`, `StatusBar`, `SessionBar` / `TabBar`, `TuiFrame` / `TuiWindow`, `IconButton`
- **Core** — `Button`, `Input`, `TextArea`, `Select` / `Dropdown`, `Checkbox`, `Toggle`, `Radio` / `RadioGroup`, `List`, `Modal`, `Popover`, `Tooltip`, `Menu`, `CommandPalette`
- **Kanban** — `KanbanBoard`, `KanbanColumn`, `KanbanCard`, `KanbanCardContent`, `KanbanSwimlane`, `applyCardMove`
- **Utility** — `KeyboardShortcutHint`, `Toast` / `ToastProvider`, `LoadingSpinner`, `Skeleton`, `ScrollableContainer`
- **Hooks** — `useKeyboardNav`, `useControllableState`, `useId`

Keyboard maps and extension points: [`docs/summary.md`](docs/summary.md). Full taxonomy: [`docs/architecture.md`](docs/architecture.md).

## License

MIT
