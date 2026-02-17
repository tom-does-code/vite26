import styles from './styles/newtask.module.css';

interface TaskProps {
    TaskTitle: string,
    TaskPriority: string,
    TaskCreatedAt: Date
}


export default function NewTask({ TaskTitle, TaskPriority, TaskCreatedAt}: TaskProps) {


    return (
        <div className={styles.newTask}>

        <h2 className={styles.TaskTitle}>Title: {TaskTitle}</h2>
        <h2 className={styles.TaskPriority}>Priority: {TaskPriority}</h2>
        <h2 className={styles.TaskCreatedAt}>Created: {TaskCreatedAt.toLocaleDateString('en-GB')}</h2>

        </div>
    )

}