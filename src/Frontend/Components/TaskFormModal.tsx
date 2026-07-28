import { useState } from 'react';
import Modal from './Modal';
import Icon from './Icon';
import form from '../Styles/Form.module.css';
import styles from '../Styles/TaskFormModal.module.css';
import type { Task, TaskInput } from '../Api/Types';
import { toDateInput } from '../Utils/Format';

interface TaskFormModalProps {
  task: Task | null;
  defaultPriority: string;
  categories: string[];
  onClose: () => void;
  onSave: (input: TaskInput) => Promise<void>;
}

const priorities = ['low', 'medium', 'high'];

export default function TaskFormModal({
  task,
  defaultPriority,
  categories,
  onClose,
  onSave
}: TaskFormModalProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState(task?.priority ?? defaultPriority);
  const [category, setCategory] = useState(task?.category ?? 'General');
  const [dueDate, setDueDate] = useState(toDateInput(task?.dueDate ?? null));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const suggestions = categories.filter((item) => item !== 'General');

  const handleSave = async () => {
    if (title.trim().length < 3) {
      setError('Give the task a title of at least 3 characters.');
      return;
    }

    setBusy(true);
    setError('');

    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        priority,
        category: category.trim() || 'General',
        dueDate: dueDate ? new Date(`${dueDate}T00:00:00Z`).toISOString() : null
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the task.');
      setBusy(false);
    }
  };

  return (
    <Modal
      title={task ? 'Edit task' : 'New task'}
      subtitle={task ? 'Update the details and save.' : 'Add something you need to get done.'}
      onClose={onClose}
      footer={
        <>
          <button className={`${form.button} ${form.ghost}`} onClick={onClose}>
            Cancel
          </button>
          <button className={`${form.button} ${form.primary}`} onClick={handleSave} disabled={busy}>
            {busy ? 'Saving' : task ? 'Save changes' : 'Create task'}
          </button>
        </>
      }
    >
      {error && (
        <div className={form.error}>
          <Icon name="error" size={17} />
          {error}
        </div>
      )}

      <div className={form.field}>
        <label className={form.label} htmlFor="task-title">
          Title
        </label>
        <input
          id="task-title"
          className={form.input}
          value={title}
          maxLength={80}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Rewrite the project README"
        />
      </div>

      <div className={form.field}>
        <label className={form.label} htmlFor="task-description">
          Description
        </label>
        <textarea
          id="task-description"
          className={form.textarea}
          value={description}
          maxLength={1000}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Anything you want to remember about this one"
        />
      </div>

      <div className={form.field}>
        <span className={form.label}>Priority</span>
        <div className={styles.priorityRow}>
          {priorities.map((value) => (
            <button
              key={value}
              type="button"
              className={
                priority === value
                  ? `${styles.priorityButton} ${styles[value]}`
                  : styles.priorityButton
              }
              onClick={() => setPriority(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className={form.row}>
        <div className={form.field}>
          <label className={form.label} htmlFor="task-category">
            Category
          </label>
          <input
            id="task-category"
            className={form.input}
            value={category}
            maxLength={30}
            list="category-options"
            onChange={(e) => setCategory(e.target.value)}
            placeholder="General"
          />
          <datalist id="category-options">
            {suggestions.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>

        <div className={form.field}>
          <label className={form.label} htmlFor="task-due">
            Due date
          </label>
          <input
            id="task-due"
            className={form.input}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
