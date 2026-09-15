import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import styles from './Input.module.css';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...rest },
  ref,
) {
  return <input ref={ref} className={cx(styles.field, className)} {...rest} />;
});

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { className, ...rest },
  ref,
) {
  return <textarea ref={ref} className={cx(styles.field, styles.area, className)} {...rest} />;
});
