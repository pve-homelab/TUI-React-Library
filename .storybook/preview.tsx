import type { Preview } from '@storybook/react';
import React from 'react';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import '../src/styles/base.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'tui-dark',
      values: [
        { name: 'tui-dark', value: '#1e1e2e' },
        { name: 'tui-light', value: '#eff1f5' },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: 'TUI theme',
      defaultValue: 'mocha',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'mocha', title: 'Mocha (dark)' },
          { value: 'latte', title: 'Latte (light)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as 'mocha' | 'latte') ?? 'mocha';
      return React.createElement(
        ThemeProvider,
        { theme, style: { minHeight: '100vh', padding: 16 } },
        React.createElement(Story),
      );
    },
  ],
};

export default preview;
