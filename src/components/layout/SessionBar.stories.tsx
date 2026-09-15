import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { KeyboardShortcutHint } from '../utility/KeyboardShortcutHint';
import { IconButton, SessionBar, type SessionTab } from './SessionBar';

const sessions: SessionTab[] = [
  { id: '0', label: '0:zsh', active: true },
  { id: '1', label: '1:agent', badge: 2 },
  { id: '2', label: '2:logs' },
];

const meta: Meta<typeof SessionBar> = {
  title: 'Layout/SessionBar',
  component: SessionBar,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof SessionBar>;

export const Default: Story = {
  args: {
    sessions,
    trailing: (
      <>
        <KeyboardShortcutHint keys={['C-b', '%']} label="vsplit" />
        <IconButton label="New session">+</IconButton>
      </>
    ),
  },
};

function SelectableStory() {
  const [activeId, setActiveId] = useState('1');
  return (
    <SessionBar
      sessions={sessions.map((session) => ({
        ...session,
        active: session.id === activeId,
      }))}
      onSelect={setActiveId}
      trailing={<KeyboardShortcutHint keys={['C-b', 'c']} label="new" />}
    />
  );
}

export const Selectable: Story = {
  render: () => <SelectableStory />,
};
