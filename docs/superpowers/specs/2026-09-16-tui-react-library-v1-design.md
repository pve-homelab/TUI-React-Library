# tui-react-library v1.0 — Production Design

**Date:** 2026-09-16  
**Status:** Approved in conversation (scope B, quality B without CI, approach 1)  
**Package:** `tui-react-library` → ship as `1.0.0`

## 1. Goal

Ship a production-ready React TUI component library covering the full taxonomy in `docs/architecture.md`, at Cloudscape-grade quality (typed APIs, Storybook, interaction tests, keyboard/a11y basics), without GitHub Actions CI.

Inspiration (non-pixel-perfect): herdr.dev TUI, `nelsonPires5/herdr-board`, tmux. Verify UX via `examples/kanban-demo` and `examples/tmux-dashboard`. Seamless cross-column Kanban DnD is a core requirement.

## 2. Non-goals (v1)

- Exact pixel clone of herdr binary UI
- Server/daemon integration with herdr socket protocol
- Native terminal rendering
- Every tmux plugin metaphor
- CI / GitHub Actions
- New headless UI dependency (Radix/Ark) — stay on primitives + CSS Modules

## 3. Approach

**Layered fill-out** of the existing Vite library stack:

1. Fix build/type debt
2. Complete missing core controls
3. Add overlays (Modal, Popover, Tooltip, Menu, CommandPalette)
4. Add utilities (Toast provider, Spinner, Skeleton, ScrollableContainer)
5. Add `KanbanSwimlane` and harden Kanban DnD
6. Stories + tests catch-up for all public APIs
7. Docs + version `1.0.0`

Tech stack (unchanged): TypeScript strict, Vite lib (ESM+CJS+dts), CSS Modules + CSS variables via `ThemeProvider`, `@dnd-kit` for Kanban, Vitest + Testing Library, Storybook 8 + a11y addon, ESLint + Prettier.

## 4. Definition of done

All of the following must pass before calling v1 production-ready:

| Gate | Requirement |
|------|-------------|
| Build | `npm run build` emits ESM, CJS, `.d.ts`, and `styles.css` |
| Types | `npm run typecheck` clean |
| Lint | `npm run lint` clean |
| Tests | `npm test` green; interaction/unit coverage for behavioral public APIs |
| Storybook | Story for every public component (or tight family); a11y addon clean on default stories |
| Keyboard docs | Maps documented in `docs/summary.md` (and story docs) for List, SessionBar, Kanban, CommandPalette, Menu |
| Examples | Both example apps run against the workspace package; tmux demo exercises ≥1 new overlay |
| Docs | README reflects production v1; `docs/summary.md` exists; architecture taxonomy matches shipped exports |
| Version | `package.json` version is `1.0.0` |
| Debt | No known TS/build blockers (including HTMLAttributes `title` / `onSelect` clashes) |

## 5. Public API surface

All exports from package root (`src/index.ts`). Import styles via `tui-react-library/styles.css`.

### Theme

- `ThemeProvider`, `useTheme`, `useThemeOptional`
- Token helpers already under `src/theme` (keep exporting what is public today)

### Layout

- `Pane`, `SplitPaneHorizontal`, `SplitPaneVertical`
- `StatusBar`
- `SessionBar`, `TabBar`
- `TuiFrame` and `TuiWindow` (`TuiWindow` is a named export alias of `TuiFrame`; one implementation)

### Core

- `Button`, `IconButton` (single `IconButton` implementation; file may remain under `components/layout` where it already lives, exported once from the package root)
- `Input`, `TextArea`
- `Select` (form listbox value picker); `Dropdown` is a named export alias of `Select` for taxonomy parity
- `Checkbox`, `Toggle`, `Radio`, `RadioGroup` (`RadioGroup` required for grouped semantics and arrow navigation)
- `List`, `ListItem`
- `Modal`, `Popover`, `Tooltip`
- `Menu`, `CommandPalette`

### Kanban

- `KanbanBoard`, `KanbanColumn`, `KanbanCard`, `KanbanCardContent`
- `KanbanSwimlane`
- `applyCardMove` + types (`KanbanCardData`, `KanbanColumnData`, `KanbanMoveEvent`, `AgentStatus`, `KanbanTag`, `KanbanCardRenderer`)

### Utility

- `KeyboardShortcutHint`
- `Toast` + toast provider (name: `ToastProvider` + `useToast`)
- `LoadingSpinner`, `Skeleton`
- `ScrollableContainer`

### Hooks

- `useKeyboardNav`, `useControllableState`, `useId`

## 6. API conventions

- Props: `variant`, `size`, `disabled`, `className`, `style` where applicable
- Events: `onChange`, `onSelect`, `onMove` (Kanban) with typed payloads
- Refs: `forwardRef` on interactive roots
- DOM prop clashes: use `Omit<HTMLAttributes<...>, 'title' | 'onSelect'>` (or the specific conflicting keys) when component props intentionally diverge from HTML
- Theming: wrap apps in `<ThemeProvider theme="mocha" | "latte" accent="...">`
- No runtime CSS-in-JS; CSS Modules + CSS custom properties only

## 7. Component behavior

### Existing — harden

- **Pane / TuiFrame / SessionBar:** fix TypeScript extends clashes; preserve current UX
- **List / SessionBar / Kanban:** keyboard via `useKeyboardNav` (arrows + `hjkl`, Enter/Space, Home/End)
- **KanbanBoard:** seamless cross-column drag-and-drop is mandatory (smooth moves; not “catch then teleport on drop”)

### New — behavior

| Component | Behavior |
|-----------|----------|
| `Select` (`Dropdown` alias) | Trigger + listbox; Arrow keys, Enter, Escape; controlled/uncontrolled via `useControllableState` |
| `Checkbox` / `Toggle` | Native-accessible controls styled with tokens; accent focus ring |
| `Radio` / `RadioGroup` | `RadioGroup` provides context/`name`; radios use arrow navigation within the group |
| `Modal` | Focus trap, Escape to close, optional backdrop dismiss, `role="dialog"` + `aria-modal` |
| `Popover` | Anchored overlay; open on click; Escape closes |
| `Tooltip` | Hover/focus only; no sticky click mode in v1 |
| `Menu` | `role="menu"`; arrow navigation; v1 is flat (no nested submenus) |
| `CommandPalette` | Modal shell + filter input + navigable `List`; global shortcut binding left to the consumer |
| `ToastProvider` / `Toast` | Queue API; auto-dismiss; polite `aria-live` region |
| `LoadingSpinner` | Presentational; `role="status"` |
| `Skeleton` | Presentational loading placeholder |
| `ScrollableContainer` | Overflow scrolling region with optional focusable container |
| `KanbanSwimlane` | Optional horizontal grouping of columns; same card move model as board |

## 8. Accessibility bar

Cloudscape-grade basics, not a formal WCAG certification:

- Correct roles and `aria-*` for interactive components
- Visible focus rings using accent token
- Storybook a11y addon clean on default stories
- Keyboard maps documented for List, SessionBar, Kanban, CommandPalette, Menu

## 9. Testing strategy

- Vitest + Testing Library (+ user-event) for each public component with real behavior
- Unit tests for pure helpers (`applyCardMove`, any swimlane grouping helpers)
- Smoke render tests for presentational-only components (`Skeleton`, `LoadingSpinner`)
- Do not delete failing tests to greenwash; fix product code (or fix clearly wrong tests only when behavior intentionally changed)

## 10. Storybook

- One story file per public component, or one file per tight family (e.g. Checkbox/Toggle/Radio) when stories remain clear
- Default story must pass a11y addon checks
- Interactive surfaces include a short keyboard-map note in story docs

## 11. Documentation & package

- README: replace “Early scaffold” with production v1 status; keep install/theming/examples accurate
- Add `docs/summary.md`: install, theming, component map, keyboard maps, extension points
- Keep `docs/architecture.md` aligned with shipped taxonomy (no phantom “coming soon” items listed as if present without status)
- `package.json` version `1.0.0`; existing `exports` for `.` and `./styles.css` remain the publish shape
- No CI configuration in scope

## 12. Examples

- `examples/kanban-demo`: primary Kanban UX verification (including DnD across columns)
- `examples/tmux-dashboard`: split panes / session chrome; add light use of ≥1 new overlay (Modal or CommandPalette)

## 13. Delivery phases (implementation order)

1. Build/type fixes (`Omit` clashes and any blocking errors)
2. Missing core controls (Select, Dropdown, Checkbox, Toggle, Radio)
3. Overlays (Modal, Popover, Tooltip, Menu, CommandPalette)
4. Utilities (Toast provider, LoadingSpinner, Skeleton, ScrollableContainer)
5. KanbanSwimlane + Kanban DnD harden if gaps remain
6. Stories and tests catch-up for all public exports
7. Docs + README + `docs/summary.md` + version bump to `1.0.0`

## 14. Success criteria (checklist)

- [ ] `npm run build` / `typecheck` / `lint` / `test` all green
- [ ] Full taxonomy exported and documented
- [ ] Storybook covers public components; a11y clean on defaults
- [ ] Keyboard maps in `docs/summary.md`
- [ ] Examples run; Kanban cross-column DnD seamless
- [ ] Version `1.0.0`
