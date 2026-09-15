import { forwardRef, type HTMLAttributes, type LiHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './List.module.css';

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  children?: ReactNode;
}

export const List = forwardRef<HTMLUListElement, ListProps>(function List(
  { className, ...rest },
  ref,
) {
  return <ul ref={ref} className={cx(styles.list, className)} role="listbox" {...rest} />;
});

export interface ListItemProps extends LiHTMLAttributes<HTMLLIElement> {
  selected?: boolean;
  focused?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
  { selected, focused, leading, trailing, className, children, ...rest },
  ref,
) {
  return (
    <li
      ref={ref}
      role="option"
      aria-selected={!!selected}
      className={cx(
        styles.item,
        selected && styles.selected,
        focused && styles.focused,
        className,
      )}
      {...rest}
    >
      {leading ? <span className={styles.leading}>{leading}</span> : null}
      <span className={styles.body}>{children}</span>
      {trailing ? <span className={styles.trailing}>{trailing}</span> : null}
    </li>
  );
});
