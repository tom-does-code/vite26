import { useState } from 'react';
import styles from './styles/taskdetails.module.css';

interface TaskDetailsProps {
    TaskTitle: string,
    TaskPriority: string,
    TaskDescription: string,
    TaskCreatedAt: string,
    TaskId: number,
    onClose: () => void;
}

export default function TaskDetails({ TaskTitle, TaskPriority, TaskDescription, TaskCreatedAt, TaskId, onClose }: TaskDetailsProps) {
    return (
        <div className={styles.BackDiv}>
            <h2 className={styles.taskHeader}>Task #{TaskId} Details</h2>

            <div className={styles.fieldGroup}>
                <p className={styles.fieldLabel}>Title</p>
                <p className={styles.fieldValue}>{TaskTitle}</p>
            </div>

            <div className={styles.fieldGroup}>
                <p className={styles.fieldLabel}>Priority</p>
                <p className={styles.fieldValue}>{TaskPriority}</p>
            </div>

            <div className={styles.fieldGroup}>
                <p className={styles.fieldLabel}>Description</p>
                <p className={styles.fieldValue}>{TaskDescription}</p>
            </div>

            <div className={styles.fieldGroup}>
                <p className={styles.fieldLabel}>Created At</p>
                <p className={styles.fieldValue}>{TaskCreatedAt}</p>
            </div>

            <button className={styles.ExitButton} onClick={() => onClose()}></button>
        </div>
    );
}
