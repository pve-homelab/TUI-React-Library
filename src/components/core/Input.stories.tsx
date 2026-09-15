import type { Meta, StoryObj } from '@storybook/react';
import { Input, TextArea } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Core/Input',
  component: Input,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Filter agents…',
    defaultValue: '',
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 'herdr',
    'aria-label': 'Search',
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 'locked',
    disabled: true,
    'aria-label': 'Locked field',
  },
};

export const Multiline: StoryObj<typeof TextArea> = {
  render: (args) => <TextArea {...args} />,
  args: {
    placeholder: 'Notes',
    defaultValue: 'Ship the board demo.\nHarden DnD.',
    rows: 4,
    'aria-label': 'Notes',
  },
};
