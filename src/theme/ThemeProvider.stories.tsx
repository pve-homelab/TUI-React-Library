import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider, useTheme } from './ThemeProvider';

function ThemeProbe() {
  const { themeName, accent, theme } = useTheme();
  return (
    <div>
      <p>
        theme={themeName} accent={accent}
      </p>
      <p>bg={theme.colors.bg}</p>
    </div>
  );
}

const meta: Meta<typeof ThemeProvider> = {
  title: 'Theme/ThemeProvider',
  component: ThemeProvider,
  parameters: {
    layout: 'padded',
  },
  // Preview already wraps stories; nest a second provider to demo props.
  decorators: [(Story) => <Story />],
};

export default meta;

type Story = StoryObj<typeof ThemeProvider>;

export const Mocha: Story = {
  render: () => (
    <ThemeProvider theme="mocha" accent="blue" style={{ padding: 16 }}>
      <ThemeProbe />
    </ThemeProvider>
  ),
};

export const LatteGreen: Story = {
  render: () => (
    <ThemeProvider theme="latte" accent="green" style={{ padding: 16 }}>
      <ThemeProbe />
    </ThemeProvider>
  ),
};
