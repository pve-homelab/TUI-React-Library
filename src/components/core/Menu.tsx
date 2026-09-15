import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { useKeyboardNav } from '../../hooks/useKeyboardNav';
import { cx } from '../../utils/cx';
import styles from './Menu.module.css';

export interface MenuItem {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface MenuProps extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
  items: MenuItem[];
  'aria-label': string;
}

export const Menu = forwardRef<HTMLUListElement, MenuProps>(function Menu(
  { items, className, onKeyDown, ...rest },
  ref,
) {
  const { activeIndex, setActiveIndex, onKeyDown: onNavKeyDown } = useKeyboardNav({
    count: items.length,
    onSelect: (index) => {
      const item = items[index];
      if (!item || item.disabled) return;
      item.onSelect?.();
    },
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    onNavKeyDown(event);
    onKeyDown?.(event);
  };

  return (
    <ul
      {...rest}
      ref={ref}
      role="menu"
      tabIndex={0}
      className={cx(styles.menu, className)}
      onKeyDown={handleKeyDown}
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        return (
          <li
            key={item.id}
            id={`menu-item-${item.id}`}
            role="menuitem"
            tabIndex={-1}
            aria-disabled={item.disabled || undefined}
            data-active={isActive || undefined}
            className={cx(
              styles.item,
              isActive && styles.active,
              item.disabled && styles.disabled,
            )}
            onMouseEnter={() => {
              if (!item.disabled) setActiveIndex(index);
            }}
            onClick={() => {
              if (item.disabled) return;
              setActiveIndex(index);
              item.onSelect?.();
            }}
          >
            {item.label}
          </li>
        );
      })}
    </ul>
  );
});
