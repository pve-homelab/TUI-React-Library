import { forwardRef, useEffect, useState, type KeyboardEvent } from 'react';
import { useKeyboardNav } from '../../hooks/useKeyboardNav';
import { cx } from '../../utils/cx';
import { Input } from './Input';
import { List, ListItem } from './List';
import { Modal } from './Modal';
import styles from './CommandPalette.module.css';

export interface CommandItem {
  id: string;
  label: string;
  keywords?: string;
  onSelect?: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
}

function matchesQuery(item: CommandItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = `${item.label} ${item.keywords ?? ''}`.toLowerCase();
  return haystack.includes(q);
}

export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  function CommandPalette(
    { open, onClose, items, placeholder = 'Type a command…' },
    ref,
  ) {
    const [query, setQuery] = useState('');

    const filtered = items.filter((item) => matchesQuery(item, query));

    const activateItem = (index: number) => {
      const item = filtered[index];
      if (!item) return;
      item.onSelect?.();
      onClose();
    };

    const { activeIndex, setActiveIndex, onKeyDown: onNavKeyDown } = useKeyboardNav({
      count: filtered.length,
      onSelect: activateItem,
    });

    useEffect(() => {
      if (!open) {
        setQuery('');
        setActiveIndex(0);
      }
    }, [open, setActiveIndex]);

    useEffect(() => {
      setActiveIndex(0);
    }, [query, setActiveIndex]);

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp' ||
        event.key === 'Home' ||
        event.key === 'End' ||
        event.key === 'Enter'
      ) {
        onNavKeyDown(event);
      }
    };

    return (
      <Modal
        ref={ref}
        open={open}
        onClose={onClose}
        aria-label="Command palette"
        className={styles.dialog}
      >
        <div className={styles.root}>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
            aria-label="Filter commands"
            className={styles.input}
            autoComplete="off"
          />
          <List className={styles.list} aria-label="Commands">
            {filtered.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <ListItem
                  key={item.id}
                  id={`command-item-${item.id}`}
                  selected={isActive}
                  focused={isActive}
                  className={cx(isActive && styles.active)}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    setActiveIndex(index);
                    activateItem(index);
                  }}
                >
                  {item.label}
                </ListItem>
              );
            })}
          </List>
        </div>
      </Modal>
    );
  },
);
