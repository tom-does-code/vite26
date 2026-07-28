import Modal from './Modal';
import form from '../Styles/Form.module.css';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      width={420}
      footer={
        <>
          <button className={`${form.button} ${form.ghost}`} onClick={onCancel}>
            Cancel
          </button>
          <button className={`${form.button} ${form.danger}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </>
      }
    >
      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{message}</p>
    </Modal>
  );
}
