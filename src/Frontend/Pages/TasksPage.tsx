import { useCallback, useEffect, useState } from 'react';
import styles from '../Styles/TasksPage.module.css';
import form from '../Styles/Form.module.css';
import PageHeader from '../Components/PageHeader';
import Icon from '../Components/Icon';
import TaskCard from '../Components/TaskCard';
import TaskFormModal from '../Components/TaskFormModal';
import TaskDetailsModal from '../Components/TaskDetailsModal';
import ConfirmDialog from '../Components/ConfirmDialog';
import EmptyState from '../Components/EmptyState';
import { api } from '../Api/Client';
import type { Task, TaskInput } from '../Api/Types';
import { usePreferences } from '../Context/PreferencesContext';
import { useToast } from '../Context/ToastContext';


const statusTabs = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' }
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [editing, setEditing] = useState<Task | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [viewing, setViewing] = useState<Task | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null);

  const { preferences } = usePreferences();
  const { notify } = useToast();

  const loadTasks = useCallback(async () => {
    const params = new URLSearchParams({ status, priority, category, sortBy });

    if (search.trim()) {
      params.set('search', search.trim());
    }

    try {
      setTasks(await api.get<Task[]>(`/tasks?${params.toString()}`));
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not load your tasks.', 'error');
    }

    setLoading(false);
  }, [search, status, priority, category, sortBy, notify]);

  const loadCategories = useCallback(async () => {
    try {
      setCategories(await api.get<string[]>('/tasks/categories'));
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadTasks, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [loadTasks, search]);

  useEffect(() => {
    const timer = setTimeout(loadCategories, 0);
    return () => clearTimeout(timer);
  }, [loadCategories]);

  const openNewTask = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEditTask = (task: Task) => {
    setViewing(null);
    setEditing(task);
    setFormOpen(true);
  };

  const saveTask = async (input: TaskInput) => {
    if (editing) {
      await api.put<Task>(`/tasks/${editing.id}`, input);
      notify('Task updated.');
    } else {
      await api.post<Task>('/tasks', input);
      notify('Task created.');
    }

    setFormOpen(false);
    setEditing(null);
    await loadTasks();
    await loadCategories();
  };

  const toggleTask = async (task: Task) => {
    setTasks(tasks.map((item) => (item.id === task.id ? { ...item, isCompleted: !item.isCompleted } : item)));

    try {
      const updated = await api.patch<Task>(`/tasks/${task.id}/toggle`);
      setViewing((current) => (current && current.id === updated.id ? updated : current));

      if (status !== 'all') {
        await loadTasks();
      } else {
        setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not update the task.', 'error');
      await loadTasks();
    }
  };

  const requestDelete = (task: Task) => {
    if (preferences.confirmBeforeDelete) {
      setPendingDelete(task);
      return;
    }

    deleteTask(task);
  };

  const deleteTask = async (task: Task) => {
    setPendingDelete(null);
    setViewing(null);
    setTasks(tasks.filter((item) => item.id !== task.id));

    try {
      await api.remove(`/tasks/${task.id}`);
      notify('Task deleted.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not delete the task.', 'error');
      await loadTasks();
    }
  };

  const clearCompleted = async () => {
    try {
      const result = await api.remove<{ removed: number }>('/tasks/completed');
      notify(result.removed === 1 ? '1 task cleared.' : `${result.removed} tasks cleared.`);
      await loadTasks();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not clear the completed tasks.', 'error');
    }
  };

  const completedCount = tasks.filter((task) => task.isCompleted).length;
  const hasFilters = search !== '' || priority !== 'all' || category !== 'all' || status !== 'all';

  return (
    <>
      <PageHeader
        title="Tasks"
        subtitle="Everything on your plate right now."
        action={
          <button className={`${form.button} ${form.primary}`} onClick={openNewTask}>
            <Icon name="add" size={19} />
            New task
          </button>
        }
      />

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Icon name="search" size={19} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks"
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch('')} aria-label="Clear search">
              <Icon name="close" size={17} />
            </button>
          )}
        </div>

        <div className={styles.tabs}>
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              className={status === tab.value ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              onClick={() => setStatus(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select className={styles.select} value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="all">Any priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select className={styles.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="due">Due date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      {completedCount > 0 && (
        <div className={styles.clearRow}>
          <span>
            {completedCount} completed {completedCount === 1 ? 'task' : 'tasks'} in this view
          </span>
          <button onClick={clearCompleted}>Clear completed</button>
        </div>
      )}

      {loading ? (
        <div className={styles.skeletonList}>
          {[0, 1, 2].map((row) => (
            <div key={row} className={styles.skeleton} />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className={styles.panel}>
          <EmptyState
            icon={hasFilters ? 'search_off' : 'task_alt'}
            title={hasFilters ? 'Nothing matches those filters' : 'No tasks yet'}
            message={
              hasFilters
                ? 'Try a different search or clear the filters to see everything.'
                : 'Add your first task and it will show up here.'
            }
            action={
              hasFilters ? (
                <button
                  className={`${form.button} ${form.ghost}`}
                  onClick={() => {
                    setSearch('');
                    setPriority('all');
                    setCategory('all');
                    setStatus('all');
                  }}
                >
                  Clear filters
                </button>
              ) : (
                <button className={`${form.button} ${form.primary}`} onClick={openNewTask}>
                  <Icon name="add" size={19} />
                  New task
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className={styles.list}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onEdit={openEditTask}
              onDelete={requestDelete}
              onOpen={setViewing}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <TaskFormModal
          task={editing}
          defaultPriority={preferences.defaultPriority}
          categories={categories}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSave={saveTask}
        />
      )}

      {viewing && (
        <TaskDetailsModal
          task={viewing}
          onClose={() => setViewing(null)}
          onEdit={openEditTask}
          onToggle={toggleTask}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this task?"
          message={`"${pendingDelete.title}" will be removed for good.`}
          onConfirm={() => deleteTask(pendingDelete)}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </>
  );
}
