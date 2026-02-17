import styles from './styles/management.module.css';
import { useState } from 'react';
import ToDoForm from './todomanagement';
import NewTask from './newtask';


export default function ManagementForm() {
    const [activeTab, setActiveTab] = useState('stats');


    return (
        <>
        
        <div className={styles.ManagementDiv}>

        <h2 className={styles.title}>Management</h2>

        <div className={styles.ManagementNav}>
            <ul className={styles.navList}>
                <li className={styles.statsBtn}><button onClick={() => setActiveTab('stats')}>Statistics</button></li>
                <li className={styles.toDoBtn}><button onClick={() => setActiveTab('todo')}>To Do List</button></li>
            </ul>
        </div>

        {activeTab === 'stats' && (
            <div className={styles.statsDiv}>

            <h2 className={styles.statTitle}>Statistics</h2>
        </div>
        )}

        {activeTab === 'todo' && (
            <>
            <ToDoForm></ToDoForm>   
            
            </>
        )}
        </div>
        </>
    )
}