import styles from './styles/newtask.module.css';

interface TaskProps {
    id: number;
    TaskTitle: string,
    TaskPriority: string,
    TaskCreatedAt: Date,
    TaskDescription: string,
    onDelete: (id: number) => void;
    displayStats: (id: number) => void;
}


export default function NewTask({ id, TaskTitle, TaskPriority, TaskCreatedAt, TaskDescription, onDelete, displayStats}: TaskProps) {


    return (
        <div className={styles.newTask} onClick={() => displayStats(id)}>
            <div className={styles.column}>
                <span className={styles.label}>Title:</span>
                <span className={styles.value}>{TaskTitle}</span>
            </div>

            <div className={styles.column}>
                <span className={styles.label}>Priority:</span>
                <span className={styles.value}>{TaskPriority}</span>
            </div>

            <div className={styles.column}>
                <span className={styles.label}>Created:</span>
                <span className={styles.value}>{TaskCreatedAt.toLocaleDateString('en-GB')}</span>
            </div>

            <div className={styles.column}>
                <span className={styles.label}><button className={styles.deleteBtn} onClick={() => onDelete(id)}></button></span>
            </div>
        </div>
    )

}