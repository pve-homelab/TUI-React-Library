import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState, type ReactNode, type RefObject } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../theme';
import { Modal } from './Modal';

function wrap(ui: ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

function ControlledModal({
  closeOnBackdrop,
  initialFocusRef,
  title = 'Confirm',
}: {
  closeOnBackdrop?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  title?: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button type="button">Outside</button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        closeOnBackdrop={closeOnBackdrop}
        initialFocusRef={initialFocusRef}
      >
        <button type="button">First</button>
        <button type="button">Second</button>
      </Modal>
    </>
  );
}

describe('Modal', () => {
  it('when open, shows dialog with aria-modal', () => {
    wrap(
      <Modal open onClose={() => {}} title="Edit">
        <p>Body</p>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('Escape calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    wrap(
      <Modal open onClose={onClose} title="Confirm">
        <button type="button">OK</button>
      </Modal>,
    );

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Tab cycles focus inside the dialog', async () => {
    const user = userEvent.setup();
    wrap(<ControlledModal />);

    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });

    first.focus();
    expect(first).toHaveFocus();

    await user.tab();
    expect(second).toHaveFocus();

    await user.tab();
    expect(first).toHaveFocus();

    await user.tab({ shift: true });
    expect(second).toHaveFocus();
  });

  it('backdrop click closes when enabled', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    wrap(
      <Modal open onClose={onClose} title="Confirm" closeOnBackdrop>
        <button type="button">OK</button>
      </Modal>,
    );

    const backdrop = screen.getByTestId('tui-modal-backdrop');
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('backdrop click does not close when disabled', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    wrap(
      <Modal open onClose={onClose} title="Confirm" closeOnBackdrop={false}>
        <button type="button">OK</button>
      </Modal>,
    );

    await user.click(screen.getByTestId('tui-modal-backdrop'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not render when closed', () => {
    wrap(
      <Modal open={false} onClose={() => {}} title="Hidden">
        <p>Body</p>
      </Modal>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('focuses initialFocusRef when provided', () => {
    const initialFocusRef = createRef<HTMLButtonElement>();
    wrap(
      <Modal open onClose={() => {}} title="Focus" initialFocusRef={initialFocusRef}>
        <button type="button">First</button>
        <button type="button" ref={initialFocusRef}>
          Target
        </button>
      </Modal>,
    );

    expect(screen.getByRole('button', { name: 'Target' })).toHaveFocus();
  });
});
