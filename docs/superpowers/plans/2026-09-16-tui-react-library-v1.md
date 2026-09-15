# tui-react-library v1.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `tui-react-library@1.0.0` with the full architecture taxonomy, Cloudscape-grade tests/stories/a11y basics, no CI.

**Architecture:** Layered fill-out of the existing Vite library (CSS Modules + ThemeProvider tokens, `@dnd-kit` Kanban). Fix type/build debt first, then core controls → overlays → utilities → KanbanSwimlane → stories/tests catch-up → docs/examples/version bump.

**Tech Stack:** React 18/19, TypeScript strict, Vite library mode + dts, CSS Modules, Vitest + Testing Library, Storybook 8 + a11y, ESLint + Prettier, `@dnd-kit`.

## Global Constraints

- Version ships as `1.0.0`
- No CI / GitHub Actions
- No Radix/Ark or other headless UI deps
- CSS Modules + CSS variables only (`--tui-*`)
- `Dropdown` is a named export alias of `Select`; `TuiWindow` is a named export alias of `TuiFrame`
- Seamless Kanban cross-column DnD is a core library requirement
- Verify UX via runnable apps under `examples/`
- Use `Omit<HTMLAttributes<...>, ...>` for conflicting DOM props (`title`, `onSelect`)
- `forwardRef` on interactive roots
- Cloudscape-grade: tests + stories + a11y basics; no formal WCAG audit
- Match existing patterns: `cx` from `src/utils/cx.ts`, ThemeProvider wrapper in tests/stories
- Work on branch `feat/v1-production` in the main workspace (scaffold was untracked; do not create an empty worktree)

---

## File structure (create/modify)

```
src/
  components/
    layout/Pane.tsx, TuiFrame.tsx, SessionBar.tsx   # Task 1
    core/
      Checkbox.tsx, Checkbox.module.css             # Task 2
      Toggle.tsx, Toggle.module.css                 # Task 2
      Radio.tsx, Radio.module.css                   # Task 2
      Select.tsx, Select.module.css                 # Task 3
      Modal.tsx, Modal.module.css                   # Task 4
      Popover.tsx, Popover.module.css               # Task 5
      Tooltip.tsx, Tooltip.module.css               # Task 5
      Menu.tsx, Menu.module.css                     # Task 6
      CommandPalette.tsx, CommandPalette.module.css # Task 7
    utility/
      Toast.tsx, Toast.module.css                   # Task 8
      LoadingSpinner.tsx, LoadingSpinner.module.css # Task 9
      Skeleton.tsx, Skeleton.module.css             # Task 9
      ScrollableContainer.tsx, ScrollableContainer.module.css # Task 9
    kanban/KanbanSwimlane.tsx (+ CSS in Kanban.module.css) # Task 10
  index.ts                                          # all tasks
  **/*.stories.tsx, **/*.test.tsx                   # per task + Task 11
docs/summary.md, docs/architecture.md, README.md    # Task 12
examples/tmux-dashboard/src/App.tsx                 # Task 12
package.json                                        # Task 12 version
```

---

### Task 1: Fix build type clashes + TuiWindow alias

**Files:**
- Modify: `src/components/layout/Pane.tsx`
- Modify: `src/components/layout/TuiFrame.tsx`
- Modify: `src/components/layout/SessionBar.tsx`
- Modify: `src/index.ts`
- Create: `src/components/layout/TuiFrame.test.tsx`
- Test: `npm run build`, `npm run typecheck`, `npm test`

**Interfaces:**
- Consumes: existing layout components
- Produces: `PaneProps` / `TuiFrameProps` / `SessionBarProps` type-safe; `TuiWindow` alias export

- [ ] **Step 1: Write failing test for TuiFrame title ReactNode**

Create `src/components/layout/TuiFrame.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../../theme';
import { TuiFrame, TuiWindow } from '../../index';

function wrap(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('TuiFrame', () => {
  it('renders ReactNode title', () => {
    wrap(<TuiFrame title={<span>Title Node</span>}>body</TuiFrame>);
    expect(screen.getByText('Title Node')).toBeInTheDocument();
  });

  it('TuiWindow is an alias of TuiFrame', () => {
    expect(TuiWindow).toBe(TuiFrame);
  });
});
```

- [ ] **Step 2: Run test — expect fail on missing `TuiWindow` export**

Run: `npx vitest run src/components/layout/TuiFrame.test.tsx`
Expected: FAIL — `TuiWindow` not exported / build still broken.

- [ ] **Step 3: Fix Omit clashes and alias**

In `Pane.tsx`, change:

```tsx
export interface PaneProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  focused?: boolean;
  scrollable?: boolean;
  headerActions?: ReactNode;
}
```

In `TuiFrame.tsx`:

```tsx
export interface TuiFrameProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  footer?: ReactNode;
}

export const TuiFrame = forwardRef<HTMLDivElement, TuiFrameProps>(function TuiFrame(
  { title, footer, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(styles.frame, className)} {...rest}>
      {title ? <div className={styles.title}>{title}</div> : null}
      <div className={styles.body}>{children}</div>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  );
});

export const TuiWindow = TuiFrame;
```

In `SessionBar.tsx`:

```tsx
export interface SessionBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  sessions: SessionTab[];
  onSelect?: (id: string) => void;
  trailing?: ReactNode;
}
```

In `src/index.ts` add:

```tsx
export { TuiFrame, TuiWindow } from './components/layout/TuiFrame';
export type { TuiFrameProps } from './components/layout/TuiFrame';
```

(Remove duplicate `TuiFrame` export if already present; keep a single export line.)

- [ ] **Step 4: Verify green**

Run: `npm run typecheck` — Expected: exit 0  
Run: `npm run build` — Expected: exit 0, emits `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`, `dist/tui-react-library.css`  
Run: `npx vitest run src/components/layout/TuiFrame.test.tsx` — Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Pane.tsx src/components/layout/TuiFrame.tsx src/components/layout/SessionBar.tsx src/components/layout/TuiFrame.test.tsx src/index.ts
git commit -m "fix: resolve layout prop type clashes and export TuiWindow"
```

---

### Task 2: Checkbox, Toggle, Radio, RadioGroup

**Files:**
- Create: `src/components/core/Checkbox.tsx`, `Checkbox.module.css`, `Checkbox.test.tsx`
- Create: `src/components/core/Toggle.tsx`, `Toggle.module.css`, `Toggle.test.tsx`
- Create: `src/components/core/Radio.tsx`, `Radio.module.css`, `Radio.test.tsx`
- Create: `src/components/core/FormControls.stories.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `useControllableState`, `useId`, `cx`, theme CSS vars
- Produces:
  - `CheckboxProps`: `checked?`, `defaultChecked?`, `onChange?(checked: boolean)`, `disabled?`, `label?`, `indeterminate?`
  - `ToggleProps`: same checked API + `label?`
  - `RadioGroupProps`: `name?`, `value?`, `defaultValue?`, `onChange?(value: string)`, `children`
  - `RadioProps`: `value: string`, `disabled?`, `children?`

- [ ] **Step 1: Write failing Checkbox/Toggle/Radio tests**

`Checkbox.test.tsx` — assert click toggles and calls `onChange(true)`.  
`Toggle.test.tsx` — assert `role="switch"` and aria-checked.  
`Radio.test.tsx` — assert RadioGroup selects value and arrow keys move selection.

- [ ] **Step 2: Run tests — expect FAIL**

Run: `npx vitest run src/components/core/Checkbox.test.tsx src/components/core/Toggle.test.tsx src/components/core/Radio.test.tsx`

- [ ] **Step 3: Implement components**

`Checkbox.tsx` — native `<input type="checkbox">` visually styled; forwardRef to input; support indeterminate via effect on `input.indeterminate`.

`Toggle.tsx` — button or checkbox with `role="switch"`; controlled via `useControllableState`.

`Radio.tsx` — `RadioGroup` context with value/onChange/name; `Radio` renders `<input type="radio">`; onKeyDown Left/Up/Right/Down move within group.

CSS: use `--tui-accent`, `--tui-border`, `--tui-focus`, spacing tokens; focus-visible outline like Button.

- [ ] **Step 4: Stories + exports**

`FormControls.stories.tsx` CSF3 with Default story wrapping ThemeProvider (preview already wraps).  
Export all from `src/index.ts`.

- [ ] **Step 5: Verify + commit**

Run: `npx vitest run src/components/core/Checkbox.test.tsx src/components/core/Toggle.test.tsx src/components/core/Radio.test.tsx`  
Run: `npm run typecheck`  
Commit: `feat: add Checkbox, Toggle, Radio, and RadioGroup`

---

### Task 3: Select (+ Dropdown alias)

**Files:**
- Create: `src/components/core/Select.tsx`, `Select.module.css`, `Select.test.tsx`, `Select.stories.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `useControllableState`, `useKeyboardNav`, `Button` patterns
- Produces:
  - `SelectOption { value: string; label: ReactNode; disabled?: boolean }`
  - `SelectProps`: `options: SelectOption[]`, `value?`, `defaultValue?`, `onChange?(value: string)`, `placeholder?`, `disabled?`, `id?`
  - `Dropdown = Select`

- [ ] **Step 1: Failing test** — open listbox on click; ArrowDown/Enter select; Escape closes; `Dropdown === Select`.

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement** — button trigger `aria-haspopup="listbox"` + `aria-expanded`; listbox popup with options `role="option"`; keyboard via `useKeyboardNav`; click outside closes (mousedown listener).

- [ ] **Step 4: Story + export `Select`, `Dropdown`, types**

- [ ] **Step 5: Verify + commit** `feat: add Select with Dropdown alias`

---

### Task 4: Modal

**Files:**
- Create: `src/components/core/Modal.tsx`, `Modal.module.css`, `Modal.test.tsx`, `Modal.stories.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- `ModalProps`: `open: boolean`, `onClose(): void`, `title?: ReactNode`, `children`, `closeOnBackdrop?: boolean` (default true), `initialFocusRef?`

- [ ] **Step 1: Failing tests** — when open, dialog visible with `aria-modal`; Escape calls onClose; Tab cycles focus inside; backdrop click closes when enabled.

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement** — portal to `document.body`; focus trap; restore focus on close; `role="dialog"`; optional title `id` linked via `aria-labelledby`.

- [ ] **Step 4: Story + export**

- [ ] **Step 5: Verify + commit** `feat: add Modal with focus trap`

---

### Task 5: Popover + Tooltip

**Files:**
- Create: `src/components/core/Popover.tsx`, `Popover.module.css`, `Popover.test.tsx`, `Popover.stories.tsx`
- Create: `src/components/core/Tooltip.tsx`, `Tooltip.module.css`, `Tooltip.test.tsx`, `Tooltip.stories.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- `PopoverProps`: `open?`, `defaultOpen?`, `onOpenChange?(open: boolean)`, `content: ReactNode`, `children` (single element trigger cloned with ref/handlers)
- `TooltipProps`: `content: ReactNode`, `children`, no click sticky mode

- [ ] **Step 1: Failing tests** — Popover toggles on trigger click, Escape closes; Tooltip shows on focus/hover, hides on blur/leave.

- [ ] **Step 2–4: Implement, stories, exports** — absolute positioning relative to trigger (`position: absolute` under relative wrapper is fine for v1).

- [ ] **Step 5: Commit** `feat: add Popover and Tooltip`

---

### Task 6: Menu

**Files:**
- Create: `src/components/core/Menu.tsx`, `Menu.module.css`, `Menu.test.tsx`, `Menu.stories.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- `MenuItem { id: string; label: ReactNode; disabled?: boolean; onSelect?: () => void }`
- `MenuProps`: `items: MenuItem[]`, `aria-label: string`

- [ ] **Step 1: Failing test** — `role="menu"` / `menuitem`; ArrowDown/Up move; Enter activates `onSelect`.

- [ ] **Step 2–4: Implement with `useKeyboardNav`**, story docs note keyboard map, export.

- [ ] **Step 5: Commit** `feat: add Menu`

---

### Task 7: CommandPalette

**Files:**
- Create: `src/components/core/CommandPalette.tsx`, `CommandPalette.module.css`, `CommandPalette.test.tsx`, `CommandPalette.stories.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- `CommandItem { id: string; label: string; keywords?: string; onSelect?: () => void }`
- `CommandPaletteProps`: `open`, `onClose()`, `items: CommandItem[]`, `placeholder?`

- [ ] **Step 1: Failing tests** — filters by query; Arrow/Enter selects; Escape closes via Modal.

- [ ] **Step 2–4: Implement using Modal + Input + List**; consumer owns global shortcut.

- [ ] **Step 5: Commit** `feat: add CommandPalette`

---

### Task 8: ToastProvider + useToast + Toast

**Files:**
- Create: `src/components/utility/Toast.tsx`, `Toast.module.css`, `Toast.test.tsx`, `Toast.stories.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- `ToastOptions { id?: string; title: ReactNode; description?: ReactNode; durationMs?: number }` (default 4000)
- `ToastProvider` wraps children; region `aria-live="polite"`
- `useToast(): { publish(opts: ToastOptions): string; dismiss(id: string): void }`

- [ ] **Step 1: Failing test** — publish shows toast; auto-dismiss after duration (use fake timers).

- [ ] **Step 2–4: Implement queue + story + exports**

- [ ] **Step 5: Commit** `feat: add ToastProvider and useToast`

---

### Task 9: LoadingSpinner, Skeleton, ScrollableContainer

**Files:**
- Create spinner/skeleton/scrollable components + module CSS + smoke tests + stories
- Modify: `src/index.ts`

**Interfaces:**
- `LoadingSpinnerProps`: `label?: string` (default "Loading"), `role="status"`
- `SkeletonProps`: `width?`, `height?`, `className?`
- `ScrollableContainerProps`: extends div attrs + `maxHeight?`

- [ ] **Step 1: Smoke tests** — spinner has status role and label text; skeleton renders; scrollable applies maxHeight.

- [ ] **Step 2–4: Implement + stories + exports**

- [ ] **Step 5: Commit** `feat: add LoadingSpinner, Skeleton, ScrollableContainer`

---

### Task 10: KanbanSwimlane + DnD harden

**Files:**
- Create: `src/components/kanban/KanbanSwimlane.tsx` (+ styles in `Kanban.module.css`)
- Create: `src/components/kanban/KanbanSwimlane.test.tsx`, `KanbanSwimlane.stories.tsx`
- Modify: `src/components/kanban/KanbanBoard.tsx` if needed for seamless cross-column DnD
- Modify: `src/index.ts`
- Read: `examples/kanban-demo` for UX expectations

**Interfaces:**
- `KanbanSwimlaneProps`: `title: ReactNode`, `children` (columns), optional `subtitle?`

- [ ] **Step 1: Failing test** — swimlane renders title and children; board still fires `onMove` across columns (unit-level with `applyCardMove` + board interaction if practical).

- [ ] **Step 2–3: Implement swimlane; audit KanbanBoard DnD** — ensure sortable/droppable config supports cross-column smooth moves (fix teleport-on-drop if present). Prefer `@dnd-kit` collision detection that keeps preview following pointer across columns.

- [ ] **Step 4: Story + export**

- [ ] **Step 5: Commit** `feat: add KanbanSwimlane and harden cross-column DnD`

---

### Task 11: Stories + tests catch-up for existing components

**Files:**
- Create stories/tests as missing for: Button, Input/TextArea, List, Pane/SplitPanes, StatusBar, SessionBar, KeyboardShortcutHint, KanbanBoard/Column/Card, ThemeProvider smoke
- Prefer co-located `Component.stories.tsx` / `Component.test.tsx`

- [ ] **Step 1: Inventory** — list public exports lacking stories or behavioral tests.

- [ ] **Step 2: Add stories** for each gap (CSF3).

- [ ] **Step 3: Add interaction tests** for List keyboard nav, SessionBar onSelect, Button disabled, Input change, KanbanBoard onMove via applyCardMove already covered — add board render smoke.

- [ ] **Step 4: Run** `npm test` and `npm run typecheck` — all green.

- [ ] **Step 5: Commit** `test: add stories and tests for existing public components`

---

### Task 12: Examples + docs + 1.0.0 ship

**Files:**
- Modify: `examples/tmux-dashboard/src/App.tsx` — add CommandPalette or Modal demo toggle
- Modify: `README.md` — production v1 status, remove Early scaffold
- Create: `docs/summary.md` — install, theming, component map, keyboard maps (List, SessionBar, Kanban, CommandPalette, Menu), extension
- Modify: `docs/architecture.md` — taxonomy matches shipped reality
- Modify: `package.json` — `"version": "1.0.0"`

- [ ] **Step 1: Update tmux example** to open CommandPalette or Modal from a button/key hint.

- [ ] **Step 2: Write `docs/summary.md`** with keyboard maps.

- [ ] **Step 3: Update README + architecture.**

- [ ] **Step 4: Bump version to 1.0.0.**

- [ ] **Step 5: Final verification**

Run:
```
npm run lint
npm run typecheck
npm test
npm run build
```
Expected: all exit 0.

- [ ] **Step 6: Commit** `chore: ship tui-react-library 1.0.0`

---

## Self-review notes

- Spec coverage: all taxonomy items mapped to Tasks 1–10; quality/docs/examples in 11–12.
- Aliases locked: Dropdown=Select, TuiWindow=TuiFrame.
- No CI tasks (explicit non-goal).
