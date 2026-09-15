import type { Meta, StoryObj } from '@storybook/react';
import { KeyboardShortcutHint } from './KeyboardShortcutHint';

const meta: Meta<typeof KeyboardShortcutHint> = {
  title: 'Utility/KeyboardShortcutHint',
  component: KeyboardShortcutHint,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof KeyboardShortcutHint>;

export const Default: Story = {
  args: {
    keys: ['C-b', '%'],
    label: 'vsplit',
  },
};

export const KeysOnly: Story = {
  args: {
    keys: ['Esc'],
  },
};

export const Chord: Story = {
  args: {
    keys: ['C-b', '"'],
    label: 'hsplit',
  },
};
