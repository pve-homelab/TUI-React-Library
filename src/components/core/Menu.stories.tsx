import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Menu, type MenuItem } from './Menu';

const meta: Meta<typeof Menu> = {
  title: 'Core/Menu',
  component: Menu,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Flat action menu (`role="menu"`). No nested submenus in v1.',
          '',
          '**Keyboard map**',
          '- `↑` / `↓` (or `k` / `j`): move active item',
          '- `Home` / `End`: first / last item',
          '- `Enter` / `Space`: activate `onSelect` on the active item',
        ].join('\n'),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Menu>;

const baseItems: MenuItem[] = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
  { id: 'delete', label: 'Delete', disabled: true },
];

export const Default: Story = {
  args: {
    'aria-label': 'Edit actions',
    items: baseItems,
  },
};

export const WithHandlers: Story = {
  render: () => {
    const [last, setLast] = useState<string | null>(null);
    const items: MenuItem[] = [
      { id: 'new', label: 'New file', onSelect: () => setLast('New file') },
      { id: 'open', label: 'Open…', onSelect: () => setLast('Open…') },
      { id: 'save', label: 'Save', onSelect: () => setLast('Save') },
      { id: 'export', label: 'Export', disabled: true },
    ];
    return (
      <div>
        <Menu aria-label="File" items={items} />
        <p style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
          Last selected: {last ?? '—'}
        </p>
      </div>
    );
  },
};
