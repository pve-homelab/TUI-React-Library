import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../core/Button';
import { Toast, ToastProvider, useToast } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Utility/Toast',
  component: Toast,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Static: Story = {
  args: {
    title: 'Build complete',
    description: 'Artifacts written to dist/',
  },
};

function DemoButtons() {
  const { publish, dismiss } = useToast();
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button
        onClick={() =>
          publish({
            title: 'Saved',
            description: 'Draft stored locally',
          })
        }
      >
        Publish toast
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          const id = publish({
            title: 'Sticky notice',
            description: 'Dismiss manually',
            durationMs: 0,
          });
          window.setTimeout(() => dismiss(id), 8000);
        }}
      >
        Sticky (8s manual)
      </Button>
    </div>
  );
}

export const ProviderQueue: Story = {
  render: () => (
    <ToastProvider>
      <DemoButtons />
    </ToastProvider>
  ),
};
