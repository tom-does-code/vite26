import styles from '../Styles/TaskCard.module.css';
import Icon from './Icon';
import type { Task } from '../Api/Types';
import { describeDueDate, formatDate } from '../Utils/Format';

interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onOpen: (task: Task) => void;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete, onOpen }: TaskCardProps) {
  const due = task.isCompleted ? null : describeDueDate(task.dueDate);

  return (
    <article className={task.isCompleted ? `${styles.card} ${styles.done}` : styles.card}>
      <button
        className={styles.checkbox}
        onClick={() => onToggle(task)}
        aria-label={task.isCompleted ? 'Mark as active' : 'Mark as complete'}
      >
        {task.isCompleted && <Icon name="check" size={16} />}
      </button>

      <div className={styles.body} onClick={() => onOpen(task)}>
        <div className={styles.topRow}>
          <h3 className={styles.title}>{task.title}</h3>
          <span className={`${styles.priority} ${styles[task.priority]}`}>{task.priority}</span>
        </div>

        {task.description && <p className={styles.description}>{task.description}</p>}

        <div className={styles.meta}>
          <span className={styles.tag}>
            <Icon name="sell" size={14} />
            {task.category}
          </span>

          <span className={styles.metaItem}>
            <Icon name="schedule" size={14} />
            {formatDate(task.createdAt)}
          </span>

          {due && <span className={`${styles.due} ${styles[due.tone]}`}>{due.label}</span>}
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={() => onEdit(task)} aria-label="Edit task">
          <Icon name="edit" size={18} />
        </button>
        <button className={styles.deleteAction} onClick={() => onDelete(task)} aria-label="Delete task">
          <Icon name="delete" size={18} />
        </button>
      </div>
    </article>
  );
}
