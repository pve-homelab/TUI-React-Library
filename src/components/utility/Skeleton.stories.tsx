import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Utility/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    width: '12rem',
    height: '1rem',
  },
};

export const Block: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 240 }}>
      <Skeleton height="1.25rem" />
      <Skeleton height="1rem" width="80%" />
      <Skeleton height="4rem" />
    </div>
  ),
};
