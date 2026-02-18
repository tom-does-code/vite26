import styles from './styles/todo.module.css';
import NewTask from './newtask';
import { useEffect, useState } from 'react';

import AddTaskModal from './AddTaskModal';
import TaskDetails from './taskdetails';

interface TaskFromDB {
    id: number,
    task_name: string;
    task_priority: string;
    created_at: string;
    task_description: string;
}

interface ActiveTabProps {
    ActiveTab: string;
}

export default function ToDoForm({ActiveTab}: ActiveTabProps) {
    const [showModal, setShowModal] = useState(false);
    const [showStats, setShowStats] = useState(true);

    const [tasks, setTasks] = useState<{id: number, title: string, priorityCap: string, createdAt: Date, description: string}[]>([]);
    const [selectedTask, setSelectedTask] = useState<{
    id: number;
    task_name: string;
    task_priority: string;
    task_description: string;
    created_at: string;
    user_id: string;
    } | null>(null);

    const addTask = async (title: string, description: string, priority: string): Promise<string | null> => {
        if (!title) return "Title is required.";
        if (title.length < 3) return "Title must be at least 3 characters.";
        if (!priority) return "Pick a priority";

        //const priorityCap = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
        const sessionToken = localStorage.getItem('token');

        await fetch('http://localhost:8080/Backend/createtask.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({sessionToken, title, priority, createdAt: new Date().toLocaleDateString('en-GB'), description})
        });

        await retrieveTasks();

        console.log('Sending: ', {sessionToken, title, priority, description})

        return null;
    };

    const retrieveTasks = async () => {
        const sessionToken = localStorage.getItem('token');
        if (!sessionToken) return "error";

        const res = await fetch('http://localhost:8080/Backend/retrievetasks.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({sessionToken}),
        })

        const data = await res.json();

        if (data.success) {
            const loadedTasks = data.tasks.map((task: TaskFromDB) => ({
                id: task.id,
                title: task.task_name,
                priorityCap: task.task_priority,
                createdAt: new Date(task.created_at),
                description: task.task_description,
            }))
            setTasks(loadedTasks);
        }
        
    }

    const deleteTask = async (id: number) => {
        setTasks(tasks.filter(task => task.id !== id));

        const sessionToken = localStorage.getItem('token');
        
        await fetch('http://localhost:8080/Backend/deletetask.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, sessionToken })
        });
    }

    const displayStats = async (id: number) => {
        const sessionToken = localStorage.getItem('token');

        const res = await fetch('http://localhost:8080/Backend/retrievesingletask.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({id, sessionToken})
        })

        const returnedTask = await res.json();

        if (returnedTask) {
            setSelectedTask(returnedTask.task);
            setShowStats(true);
        }
    }

    useEffect(() => {
        if (ActiveTab === 'todo') {
            const fetchTasks = async () => {
                await retrieveTasks();
            };
            fetchTasks();
        }
    }, [ActiveTab]);

    return (
        <>
        <div className={styles.ToDoDiv}>
            <h2 className={styles.title}>To Do</h2>
            <div className={styles.currentTaskSection}>
                <h3 className={styles.subheading}>Current Tasks</h3>
                <button className={styles.addTaskButton} onClick={() => setShowModal(true)}>New Task</button>
                {tasks.map((task) => (
                    <NewTask
                        id={task.id}
                        key={task.id}
                        TaskTitle={task.title}
                        TaskPriority={task.priorityCap}
                        TaskCreatedAt={task.createdAt}
                        TaskDescription={task.description}
                        onDelete={deleteTask}
                        displayStats={displayStats}
                    />
                ))}
            </div>
        </div>
       
        {showModal && <AddTaskModal onClose={() => setShowModal(false)} onSubmit={addTask}/>}
        {showStats && selectedTask &&
        <TaskDetails 
            TaskTitle={selectedTask.task_name}
            TaskPriority={selectedTask.task_priority}
            TaskDescription={selectedTask.task_description}
            TaskCreatedAt={selectedTask.created_at}
            TaskId={selectedTask.id}
            onClose={() => { setShowStats(false); setSelectedTask(null); }}
            />
        }
        </>
    );
}