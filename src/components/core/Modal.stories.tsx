import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Core/Modal',
  component: Modal,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

function DefaultStory() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Confirm action">
        <p>Are you sure you want to continue?</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </div>
      </Modal>
    </>
  );
}

export const Default: Story = {
  render: () => <DefaultStory />,
};

function InitialFocusStory() {
  const [open, setOpen] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open with initial focus</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete item"
        initialFocusRef={confirmRef}
      >
        <p>This cannot be undone.</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button ref={confirmRef} variant="danger" onClick={() => setOpen(false)}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}

export const InitialFocus: Story = {
  render: () => <InitialFocusStory />,
};

function NoBackdropCloseStory() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open (Esc only)</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Locked backdrop"
        closeOnBackdrop={false}
      >
        <p>Clicking the backdrop will not close this dialog. Press Escape or use a button.</p>
        <Button onClick={() => setOpen(false)} style={{ marginTop: 12 }}>
          Close
        </Button>
      </Modal>
    </>
  );
}

export const NoBackdropClose: Story = {
  render: () => <NoBackdropCloseStory />,
};
