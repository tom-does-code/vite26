import styles from './styles/management.module.css';
import { useState } from 'react';
import ToDoForm from './todomanagement';
import StatsSection from './statssection';



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
            <StatsSection userID="123" tasksCompleted={3} tasksCreated={5} dateCreated={new Date().toLocaleDateString('en-GB')}></StatsSection>
        )}

        {activeTab === 'todo' && (
            <>
            <ToDoForm ActiveTab={activeTab}></ToDoForm>   
            </>
        )}
        </div>
        </>
    )
}