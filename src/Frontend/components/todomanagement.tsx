import styles from './styles/todo.module.css';
import NewTask from './newtask';
import { useState } from 'react';

export default function ToDoForm() {
    const [tasks, setTasks] = useState([
        { title: '123456', priority: 'high', createdAt: new Date() }
    ]);

    const addTask = (title: string, priority: string) => {
        setTasks([...tasks, { title, priority, createdAt: new Date() }]);
    };

    return (
        <div className={styles.ToDoDiv}>
            <h2 className={styles.title}>To Do</h2>
            <div className={styles.currentTaskSection}>
                <h3 className={styles.subheading}>Current Tasks</h3>
                <button className={styles.addTaskButton} onClick={() => addTask('New task', 'medium')}>Add Task</button>
                {tasks.map((task, index) => (
                    <NewTask
                        key={index}
                        TaskTitle={task.title}
                        TaskPriority={task.priority}
                        TaskCreatedAt={task.createdAt}
                    />
                ))}
            </div>
        </div>
    );
}