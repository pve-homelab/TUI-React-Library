import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from './Button';
import { Popover } from './Popover';

const meta: Meta<typeof Popover> = {
  title: 'Core/Popover',
  component: Popover,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover content={<p style={{ margin: 0 }}>Anchored popover content</p>}>
      <Button>Toggle popover</Button>
    </Popover>
  ),
};

function ControlledStory() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Popover
        open={open}
        onOpenChange={setOpen}
        content={
          <div>
            <p style={{ margin: '0 0 8px' }}>Controlled open state</p>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        <Button>Controlled</Button>
      </Popover>
      <span style={{ fontSize: 12, opacity: 0.7 }}>open: {String(open)}</span>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledStory />,
};

export const DefaultOpen: Story = {
  render: () => (
    <Popover defaultOpen content={<p style={{ margin: 0 }}>Starts open. Press Escape to close.</p>}>
      <Button>Default open</Button>
    </Popover>
  ),
};
