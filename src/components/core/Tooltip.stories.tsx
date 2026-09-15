import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Core/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <div style={{ paddingTop: 48 }}>
      <Tooltip content="Hover or focus for details">
        <Button>Hover me</Button>
      </Tooltip>
    </div>
  ),
};

export const OnIconLikeTrigger: Story = {
  render: () => (
    <div style={{ paddingTop: 48, display: 'flex', gap: 16 }}>
      <Tooltip content="Save draft">
        <Button size="sm" variant="ghost">
          Save
        </Button>
      </Tooltip>
      <Tooltip content="Delete permanently">
        <Button size="sm" variant="danger">
          Delete
        </Button>
      </Tooltip>
    </div>
  ),
};
