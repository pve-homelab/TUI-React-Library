import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select, type SelectOption } from './Select';

const options: SelectOption[] = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta' },
  { value: 'gamma', label: 'Gamma', disabled: true },
  { value: 'delta', label: 'Delta' },
];

const meta: Meta<typeof Select> = {
  title: 'Core/Select',
  component: Select,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    options,
    placeholder: 'Pick one',
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('beta');
    return <Select options={options} value={value} onChange={setValue} />;
  },
};
