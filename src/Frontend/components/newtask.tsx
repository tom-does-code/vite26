import styles from './styles/newtask.module.css';

interface TaskProps {
    TaskTitle: string,
    TaskPriority: string,
    TaskCreatedAt: Date
}


export default function NewTask({ TaskTitle, TaskPriority, TaskCreatedAt}: TaskProps) {


    return (
        <div className={styles.newTask}>
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
        </div>
    )

}