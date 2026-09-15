import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('has status role and default label text', () => {
    render(<LoadingSpinner />);
    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent('Loading');
  });

  it('renders a custom label', () => {
    render(<LoadingSpinner label="Fetching agents" />);
    expect(screen.getByRole('status')).toHaveTextContent('Fetching agents');
  });
});
