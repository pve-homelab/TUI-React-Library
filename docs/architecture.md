# Architecture — TUI React Library

Production-grade React component library inspired by **herdr.dev**, **herdr-board**, and **tmux**.

Package name: `tui-react-library` · version **1.0.0**

## Design principles

1. **Terminal-first aesthetics** — Catppuccin-inspired palette (herdr default theme family), box-drawing borders, monospace typography, dense information density.
2. **Keyboard-first UX** — Interactive surfaces navigable without a mouse; shortcuts mirror tmux/herdr metaphors (`h/j/k/l`, prefix-style hints).
3. **Composable primitives** — Small layout atoms (`Pane`, `SplitPane`, `TuiFrame`) compose into sessions, boards, and dashboards.
4. **Token-driven theming** — CSS custom properties injected by `ThemeProvider`; no global style leakage.
5. **Cloudscape-level maturity** — Typed APIs, Storybook docs, tests, accessibility basics, publishable package.

## Inspiration mapping

| Source | Patterns extracted | Library manifestation |
|--------|--------------------|------------------------|
| herdr.dev TUI | Sidebar + tab surface + panes; agent status dots; mode overlays; status/mode bars | `SessionBar`, `StatusBar`, `TuiFrame`, `List`, status tokens |
| herdr-board | Columns, cards, DnD, compact/regular/wide, keyboard move (`H`/`L`), badges | `KanbanBoard`, `KanbanColumn`, `KanbanCard`, `KanbanSwimlane`, `@dnd-kit` |
| tmux | Sessions → windows → panes; `Ctrl+b %/"` splits; status bar | `SplitPaneHorizontal/Vertical`, `StatusBar`, `SessionBar` |

## Design system tokens

### Color (Catppuccin Mocha dark / Latte light)

| Token | Role |
|-------|------|
| `bg`, `surface0–2` | Base / elevated surfaces |
| `overlay0–1` | Borders, subtle chrome |
| `text`, `subtext0–1` | Primary / secondary copy |
| `accent` | Focus, selection, active tab (blue by default) |
| `green`, `yellow`, `red`, `peach`, `teal`, `mauve` | Semantic / agent status |

### Typography

- Font: `JetBrains Mono`, `Fira Code`, `Cascadia Code`, `ui-monospace`, monospace
- Scale: `xs` 11px → `sm` 12px → `md` 13px → `lg` 15px → `xl` 18px
- Line height: 1.35–1.5 for dense TUI rows

### Spacing & chrome

- 4px base unit (`space-1` … `space-8`)
- Borders: 1px solid overlay; focus ring: 2px accent
- Radius: 0–2px (TUI-flat); optional `soft` theme bump to 4px
- Shadows: none by default (terminal flat); soft elevation only for overlays

## Component taxonomy (shipped)

Public API is the package root export surface in `src/index.ts`. Import styles via `tui-react-library/styles.css`.

### Theme

- `ThemeProvider`, `useTheme`, `useThemeOptional`
- `createTheme`, `defaultTheme`, `themeToCssVars` (+ token types)

### Layout & tmux primitives

- `Pane` — content region with optional title/focus
- `SplitPaneHorizontal` / `SplitPaneVertical` — resizable splits
- `StatusBar` — left/center/right segments
- `SessionBar` / `TabBar` — session/window tabs (`TabBar` is an alias of `SessionBar`)
- `TuiFrame` / `TuiWindow` — bordered frame with title bar (`TuiWindow` is an alias of `TuiFrame`)
- `IconButton` — labeled icon control (exported from layout)

### Core TUI

- `Button`
- `Input`, `TextArea`
- `Select` / `Dropdown` (`Dropdown` is an alias of `Select`)
- `Checkbox`, `Toggle`, `Radio`, `RadioGroup`
- `List`, `ListItem`
- `Modal`, `Popover`, `Tooltip`
- `Menu`, `CommandPalette`

### Kanban

- `KanbanBoard` — DnD context + column layout; seamless cross-column drag
- `KanbanColumn` — header, count, droppable list
- `KanbanCard` / `KanbanCardContent` — title, meta, tags, status
- `KanbanSwimlane` — optional horizontal grouping of columns
- `applyCardMove` + types (`KanbanCardData`, `KanbanColumnData`, `KanbanMoveEvent`, `AgentStatus`, `KanbanTag`, `KanbanCardRenderer`)

### Utility

- `KeyboardShortcutHint`
- `Toast`, `ToastProvider`, `useToast`
- `LoadingSpinner`, `Skeleton`
- `ScrollableContainer`

### Hooks

- `useKeyboardNav`, `useControllableState`, `useId`

## Folder structure

```
src/
  theme/           # tokens, ThemeProvider, CSS vars
  hooks/           # useKeyboardNav, useControllableState, useId
  components/
    layout/
    core/
    kanban/
    utility/
  styles/          # reset helpers, shared module utilities
  index.ts         # public API
docs/              # architecture, summary
.storybook/        # Storybook 8
examples/
  kanban-demo/
  tmux-dashboard/
```

## Technical stack

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Build | Vite library mode + `vite-plugin-dts` | Fast, ESM+CJS, types |
| Language | TypeScript strict | Cloudscape-level DX |
| Styling | CSS Modules + CSS variables | Encapsulated, no runtime CSS-in-JS tax |
| DnD | `@dnd-kit/core` + `sortable` | Accessible, maintained |
| Docs | Storybook 8 | Visual + a11y addon |
| Test | Vitest + Testing Library + jsdom | Unit + interaction |
| Lint/format | ESLint flat + Prettier | Consistency |

## API conventions

- Props: `variant`, `size`, `disabled`, `className`, `style` where applicable
- Events: `onChange`, `onSelect`, `onMove` (Kanban) with typed payloads
- Refs: `forwardRef` on interactive roots
- DOM clashes: `Omit<HTMLAttributes<...>, 'title' | 'onSelect'>` (or specific keys) when component props diverge from HTML
- Accessibility: roles, `aria-*`, visible focus rings using accent token
- Theming: wrap app in `<ThemeProvider theme="mocha" | "latte" accent="blue">`
- No runtime CSS-in-JS; CSS Modules + CSS custom properties only

## Non-goals (v1)

- Exact pixel clone of herdr binary UI
- Server/daemon integration with herdr socket protocol
- Native terminal rendering (this is a web React library)
- Every tmux plugin metaphor
- CI / GitHub Actions
- New headless UI dependency (Radix/Ark) — stay on primitives + CSS Modules

## Success criteria

- `npm run build` emits ESM, CJS, `.d.ts`, and `styles.css`
- `npm run typecheck` / `lint` / `test` green
- Storybook documents public components; a11y clean on defaults
- Keyboard maps in [`docs/summary.md`](./summary.md)
- Example apps consume the library via workspace/path dependency
- README + `docs/summary.md` explain install, theming, extension
- Package version `1.0.0`
