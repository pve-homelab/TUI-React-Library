import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Button } from './Button';
import { CommandPalette, type CommandItem } from './CommandPalette';

const meta: Meta<typeof CommandPalette> = {
  title: 'Core/CommandPalette',
  component: CommandPalette,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Modal command palette: filter input + navigable list. Global shortcut binding is left to the consumer.',
          '',
          '**Keyboard map**',
          '- Type in the filter to match `label` / `keywords`',
          '- `↑` / `↓`: move active item',
          '- `Home` / `End`: first / last item',
          '- `Enter`: activate `onSelect` on the active item',
          '- `Escape`: close (Modal)',
        ].join('\n'),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CommandPalette>;

const demoItems = (setLast: (label: string) => void): CommandItem[] => [
  { id: 'new', label: 'New file', onSelect: () => setLast('New file') },
  {
    id: 'open',
    label: 'Open file',
    keywords: 'browse load',
    onSelect: () => setLast('Open file'),
  },
  { id: 'save', label: 'Save', onSelect: () => setLast('Save') },
  { id: 'quit', label: 'Quit', keywords: 'exit', onSelect: () => setLast('Quit') },
];

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [last, setLast] = useState<string | null>(null);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open command palette</Button>
        <p style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
          Last selected: {last ?? '—'}
        </p>
        <CommandPalette
          open={open}
          onClose={() => setOpen(false)}
          items={demoItems((label) => {
            setLast(label);
            setOpen(false);
          })}
        />
      </div>
    );
  },
};

export const ConsumerOwnsShortcut: Story = {
  name: 'Consumer owns shortcut (Ctrl/Cmd+K)',
  render: () => {
    const [open, setOpen] = useState(false);
    const [last, setLast] = useState<string | null>(null);

    useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
          event.preventDefault();
          setOpen(true);
        }
      };
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
      <div>
        <p style={{ fontSize: 12, opacity: 0.7 }}>
          Press Ctrl/Cmd+K to open (consumer-owned binding).
        </p>
        <p style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
          Last selected: {last ?? '—'}
        </p>
        <CommandPalette
          open={open}
          onClose={() => setOpen(false)}
          items={demoItems((label) => {
            setLast(label);
            setOpen(false);
          })}
        />
      </div>
    );
  },
};
