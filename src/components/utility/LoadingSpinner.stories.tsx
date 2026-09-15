import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Utility/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: {
    label: 'Syncing sessions…',
  },
};
