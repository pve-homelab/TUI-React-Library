import type { Meta, StoryObj } from '@storybook/react';
import { StatusBar } from './StatusBar';

const meta: Meta<typeof StatusBar> = {
  title: 'Layout/StatusBar',
  component: StatusBar,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof StatusBar>;

export const Default: Story = {
  args: {
    left: 'herdr · working',
    center: 'pane 1:agent',
    right: 'mocha · 14:32',
  },
};

export const LeftOnly: Story = {
  args: {
    left: 'ready',
  },
};
