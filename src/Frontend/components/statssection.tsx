import styles from './styles/statsSection.module.css';
import { useState } from 'react';

export default function StatsSection() {
    const [showStats, setShowStats] = useState(false);
    const [idInput, setIdInput] = useState<string | null>(null);

    const [accountCreated, setAccountCreated] = useState<string | null>(null);
    const [tasksCreated, setTasksCreated] = useState<number | null>(null);

    const submitClick = async () => {
        if (idInput) {
            const res = await fetch('http://localhost:8080/Backend/retrievestats.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ idInput })
            })

            const data = await res.json();

            if (data.success) {
                console.log('run');
                setShowStats(true);
                setAccountCreated(data.accountCreated);
                setTasksCreated(data.tasksCreated);
            } else {
                console.log('err');
                return;
            }
        }
    }

    return (
        <>
        
        <div className={styles.StatsDiv}>

            <div className={styles.statsBackdrop}>
                <h1 className={styles.statsHeader}>Statistics</h1>
                <input className={styles.idInput} onChange={(e) => setIdInput(e.target.value)} placeholder="User ID"></input>
                <p className={styles.error}></p>
                <button className={styles.searchButton} onClick={() => {submitClick()}}>Search</button>
                
                {showStats && (
                    <div className={styles.statsRow}>
                    <div className={styles.statColumn}>
                        <h2 className={styles.statTitle}>Account Created</h2>
                        <p className={styles.statValue}>{accountCreated}</p>
                    </div>
                    
                    <div className={styles.statColumn}>
                        <h2 className={styles.statTitle}>Tasks Created</h2>
                        <p className={styles.statValue}>{tasksCreated}</p>
                    </div>

                    <div className={styles.statColumn}>
                        <h2 className={styles.statTitle}>Tasks Completed</h2>
                        <p className={styles.statValue}></p>
                    </div>
                </div>
                )}
            </div>
        </div>
        </>
    )
}
