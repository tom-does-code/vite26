import styles from './styles/todo.module.css';

export default function ToDoForm() {

    return (
        <div className={styles.ToDoDiv}>
            <h2 className={styles.title}>To Do</h2>
            <div className={styles.currentTaskSection}>
                <h3 className={styles.subheading}>Current Tasks</h3>
            </div>
        </div>
    )
}