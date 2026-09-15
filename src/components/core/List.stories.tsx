import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { useKeyboardNav } from '../../hooks';
import { List, ListItem } from './List';

const items = [
  { id: 'herdr', label: 'herdr', harness: 'claude' },
  { id: 'explore', label: 'explore', harness: 'opencode' },
  { id: 'dash', label: 'web-dashboard', harness: 'claude' },
];

const meta: Meta<typeof List> = {
  title: 'Core/List',
  component: List,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof List>;

export const Default: Story = {
  render: () => (
    <List style={{ maxWidth: 280 }}>
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          selected={index === 0}
          focused={index === 0}
          leading="●"
          trailing={item.harness}
        >
          {item.label}
        </ListItem>
      ))}
    </List>
  ),
};

function KeyboardNavStory() {
  const [selected, setSelected] = useState(0);
  const { activeIndex, onKeyDown } = useKeyboardNav({
    count: items.length,
    onSelect: setSelected,
  });

  return (
    <List tabIndex={0} onKeyDown={onKeyDown} style={{ maxWidth: 280 }}>
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          selected={index === selected}
          focused={index === activeIndex}
          leading="○"
          trailing={item.harness}
          onClick={() => setSelected(index)}
        >
          {item.label}
        </ListItem>
      ))}
    </List>
  );
}

export const KeyboardNav: Story = {
  render: () => <KeyboardNavStory />,
};
