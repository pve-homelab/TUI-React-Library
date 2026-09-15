import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import { Toggle } from './Toggle';
import { Radio, RadioGroup } from './Radio';

const meta: Meta = {
  title: 'Core/FormControls',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320 }}>
      <Checkbox label="Enable logging" defaultChecked />
      <Checkbox label="Partial selection" indeterminate />
      <Toggle label="Dark mode" defaultChecked />
      <RadioGroup name="density" defaultValue="comfortable">
        <Radio value="compact">Compact</Radio>
        <Radio value="comfortable">Comfortable</Radio>
        <Radio value="spacious">Spacious</Radio>
      </RadioGroup>
    </div>
  ),
};
