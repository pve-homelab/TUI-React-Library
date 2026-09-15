import type { Meta, StoryObj } from '@storybook/react';
import { Pane, SplitPaneHorizontal, SplitPaneVertical } from './Pane';

const meta: Meta<typeof Pane> = {
  title: 'Layout/Pane',
  component: Pane,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof Pane>;

export const Default: Story = {
  args: {
    title: 'spaces',
    focused: true,
    children: 'Pane body',
  },
};

export const WithActions: Story = {
  args: {
    title: 'agent',
    headerActions: <span style={{ color: 'var(--tui-green)' }}>working</span>,
    children: <pre style={{ margin: 0 }}>$ bun run dev</pre>,
  },
};

export const HorizontalSplit: Story = {
  render: () => (
    <div style={{ height: 240 }}>
      <SplitPaneHorizontal initialSizes={[30, 70]}>
        <Pane title="left" focused>
          Left pane
        </Pane>
        <Pane title="right">Right pane</Pane>
      </SplitPaneHorizontal>
    </div>
  ),
};

export const NestedSplits: Story = {
  render: () => (
    <div style={{ height: 320 }}>
      <SplitPaneHorizontal initialSizes={[28, 72]}>
        <Pane title="sidebar" focused>
          Sidebar
        </Pane>
        <SplitPaneVertical initialSizes={[60, 40]}>
          <Pane title="main">Main</Pane>
          <SplitPaneHorizontal initialSizes={[50, 50]}>
            <Pane title="shell">Shell</Pane>
            <Pane title="agent">Agent</Pane>
          </SplitPaneHorizontal>
        </SplitPaneVertical>
      </SplitPaneHorizontal>
    </div>
  ),
};
