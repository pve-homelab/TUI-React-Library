import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../theme';
import { ToastProvider, useToast } from './Toast';

function wrap(ui: ReactNode) {
  return render(
    <ThemeProvider>
      <ToastProvider>{ui}</ToastProvider>
    </ThemeProvider>,
  );
}

function PublishOnMount({
  title,
  description,
  durationMs,
  id,
}: {
  title: string;
  description?: string;
  durationMs?: number;
  id?: string;
}) {
  const { publish } = useToast();
  useEffect(() => {
    publish({ title, description, durationMs, id });
  }, [publish, title, description, durationMs, id]);
  return null;
}

function PublishAndDismiss({ title }: { title: string }) {
  const { publish, dismiss } = useToast();
  useEffect(() => {
    const id = publish({ title, durationMs: 10_000 });
    dismiss(id);
  }, [publish, dismiss, title]);
  return null;
}

function PublishButton({ title }: { title: string }) {
  const { publish } = useToast();
  return (
    <button type="button" onClick={() => publish({ title, durationMs: 500 })}>
      Show toast
    </button>
  );
}

describe('ToastProvider / useToast', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('publish shows toast and auto-dismisses after duration', () => {
    vi.useFakeTimers();
    wrap(<PublishOnMount title="Saved" durationMs={1000} />);

    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(screen.getByText('Saved')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('auto-dismisses after default duration of 4000ms', () => {
    vi.useFakeTimers();
    wrap(<PublishOnMount title="Done" />);

    expect(screen.getByText('Done')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3999);
    });
    expect(screen.getByText('Done')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByText('Done')).not.toBeInTheDocument();
  });

  it('dismiss removes a toast by id', () => {
    wrap(<PublishAndDismiss title="Gone" />);
    expect(screen.queryByText('Gone')).not.toBeInTheDocument();
  });

  it('queues multiple toasts', async () => {
    const user = userEvent.setup();
    wrap(<PublishButton title="Hello" />);

    await user.click(screen.getByRole('button', { name: 'Show toast' }));
    await user.click(screen.getByRole('button', { name: 'Show toast' }));

    expect(screen.getAllByText('Hello')).toHaveLength(2);
  });

  it('renders description when provided', () => {
    wrap(<PublishOnMount title="Title" description="More detail" durationMs={10_000} />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('More detail')).toBeInTheDocument();
  });
});
