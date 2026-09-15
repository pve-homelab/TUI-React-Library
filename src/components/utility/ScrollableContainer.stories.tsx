import type { Meta, StoryObj } from '@storybook/react';
import { ScrollableContainer } from './ScrollableContainer';

const meta: Meta<typeof ScrollableContainer> = {
  title: 'Utility/ScrollableContainer',
  component: ScrollableContainer,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof ScrollableContainer>;

const lines = Array.from({ length: 24 }, (_, i) => `line ${i + 1}: pane output`);

export const Default: Story = {
  args: {
    maxHeight: '8rem',
    children: (
      <pre style={{ margin: 0, font: 'inherit', whiteSpace: 'pre-wrap' }}>{lines.join('\n')}</pre>
    ),
  },
};
