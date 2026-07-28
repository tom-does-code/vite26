import Modal from './Modal';
import Icon from './Icon';
import form from '../Styles/Form.module.css';
import styles from '../Styles/TaskDetailsModal.module.css';
import type { Task } from '../Api/Types';
import { describeDueDate, formatDate } from '../Utils/Format';

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onToggle: (task: Task) => void;
}

export default function TaskDetailsModal({ task, onClose, onEdit, onToggle }: TaskDetailsModalProps) {
  const due = describeDueDate(task.dueDate);

  return (
    <Modal
      title={task.title}
      subtitle={`Task #${task.id}`}
      onClose={onClose}
      footer={
        <>
          <button className={`${form.button} ${form.ghost}`} onClick={() => onToggle(task)}>
            <Icon name={task.isCompleted ? 'undo' : 'check'} size={18} />
            {task.isCompleted ? 'Reopen' : 'Mark complete'}
          </button>
          <button className={`${form.button} ${form.primary}`} onClick={() => onEdit(task)}>
            <Icon name="edit" size={18} />
            Edit
          </button>
        </>
      }
    >
      <div className={styles.badges}>
        <span className={`${styles.badge} ${styles[task.priority]}`}>{task.priority} priority</span>
        <span className={styles.badge}>{task.category}</span>
        {task.isCompleted && <span className={`${styles.badge} ${styles.completed}`}>Completed</span>}
      </div>

      <p className={styles.description}>
        {task.description || 'No description was added for this task.'}
      </p>

      <dl className={styles.details}>
        <div>
          <dt>Created</dt>
          <dd>{formatDate(task.createdAt)}</dd>
        </div>
        <div>
          <dt>Due</dt>
          <dd>{task.dueDate ? formatDate(task.dueDate) : 'No due date'}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{task.isCompleted ? `Done ${formatDate(task.completedAt)}` : due ? due.label : 'Active'}</dd>
        </div>
      </dl>
    </Modal>
  );
}
