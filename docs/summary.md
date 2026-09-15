# tui-react-library — Summary

Production React TUI component library (`1.0.0`) inspired by herdr.dev, herdr-board, and tmux.

## Install

```bash
npm install tui-react-library
```

Peer dependencies: `react` and `react-dom` (`^18.2 || ^19`).

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

Import styles once at the app root via `tui-react-library/styles.css`.

## Theming

Wrap the tree in `ThemeProvider`. Tokens are CSS custom properties scoped to the provider root (`--tui-bg`, `--tui-accent`, …).

| Prop | Values | Default |
|------|--------|---------|
| `theme` | `mocha` (dark), `latte` (light) | `mocha` |
| `accent` | `blue`, `teal`, `mauve`, `peach`, `green` | `blue` |

Helpers: `useTheme`, `useThemeOptional`, `createTheme`, `themeToCssVars`.

## Component map

All exports come from the package root (`src/index.ts`).

### Theme

`ThemeProvider`, `useTheme`, `useThemeOptional`, `createTheme`, `defaultTheme`, `themeToCssVars`

### Layout

`Pane`, `SplitPaneHorizontal`, `SplitPaneVertical`, `StatusBar`, `SessionBar` / `TabBar`, `TuiFrame` / `TuiWindow` (alias), `IconButton`

### Core

`Button`, `Input`, `TextArea`, `Select` / `Dropdown` (alias), `Checkbox`, `Toggle`, `Radio`, `RadioGroup`, `List`, `ListItem`, `Modal`, `Popover`, `Tooltip`, `Menu`, `CommandPalette`

### Kanban

`KanbanBoard`, `KanbanColumn`, `KanbanCard`, `KanbanCardContent`, `KanbanSwimlane`, `applyCardMove` + related types

### Utility

`KeyboardShortcutHint`, `Toast`, `ToastProvider`, `useToast`, `LoadingSpinner`, `Skeleton`, `ScrollableContainer`

### Hooks

`useKeyboardNav`, `useControllableState`, `useId`

## Keyboard maps

### List

`List` / `ListItem` are presentational. Wire focus + navigation with `useKeyboardNav` (vertical):

| Key | Action |
|-----|--------|
| `↑` / `↓` or `k` / `j` | Move active index |
| `Home` / `End` | First / last item |
| `Enter` / `Space` | Call `onSelect(activeIndex)` |

Give the list `tabIndex={0}` and pass `onKeyDown` from the hook. Mark the active row with `focused` / `selected` on `ListItem`.

### SessionBar

`SessionBar` renders a `role="tablist"` of native `role="tab"` buttons with horizontal `useKeyboardNav` (roving `tabIndex`):

| Key | Action |
|-----|--------|
| `←` / `→` or `h` / `l` | Move focus between session tabs |
| `Home` / `End` | First / last tab |
| `Enter` / `Space` | Activate focused tab (`onSelect(id)`) |
| `Tab` / `Shift+Tab` | Leave the tablist (trailing controls remain in tab order) |
| Click | Select session |

### Kanban

Focus the board (`tabIndex={0}` on the board root). With a selected card:

| Key / input | Action |
|-------------|--------|
| Pointer drag | Seamless cross-column move (live preview; commit on drop) |
| `H` | Shove selected card one column left |
| `L` | Shove selected card one column right |

`onMove` receives `{ cardId, fromColumnId, toColumnId, toIndex }`. Apply with `applyCardMove` (or your own reducer).

### CommandPalette

Modal shell + filter `Input` + navigable `List`. Global open shortcuts are consumer-owned (examples use `Ctrl/Cmd+K`).

| Key | Action |
|-----|--------|
| Type | Filter by `label` / `keywords` |
| `↑` / `↓` | Move active command |
| `Home` / `End` | First / last filtered item |
| `Enter` | Run active item `onSelect`, then call `onClose` |
| `Escape` | Close |

### Menu

Flat `role="menu"` (no nested submenus in v1). Focus the menu root:

| Key | Action |
|-----|--------|
| `↑` / `↓` or `k` / `j` | Move active item (skips `disabled`) |
| `Home` / `End` | First / last enabled item |
| `Enter` / `Space` | Activate `onSelect` (skips `disabled`) |

## Examples

| App | Purpose |
|-----|---------|
| `examples/kanban-demo` | Kanban UX + cross-column DnD (`npm run examples:kanban`) |
| `examples/tmux-dashboard` | Splits, session/status chrome, CommandPalette (`npm run examples:tmux`) |

## Extension

- **Tokens** — pass a custom theme via `createTheme` / `ThemeProvider`, or override `--tui-*` CSS variables under the provider root.
- **Kanban cards** — supply `renderCard` on `KanbanBoard` / swimlanes for custom card chrome while keeping DnD/`onMove`.
- **Overlays** — compose `Modal`, `Popover`, `Menu`, and `CommandPalette`; bind global shortcuts outside the library.
- **Keyboard** — reuse `useKeyboardNav` for any vertical/horizontal list-like surface.
- **Toasts** — wrap with `ToastProvider` and call `useToast().push(...)`.

See [`architecture.md`](./architecture.md) for principles, stack, and folder layout. Storybook documents each public component (`npm run storybook`).
