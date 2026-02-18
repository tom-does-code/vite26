import styles from './styles/AddTaskModal.module.css';
import { useState } from 'react';

interface AddTaskModalProps {
    onClose: () => void;
    onSubmit: (title: string, description: string, priority: string) => Promise<string | null>;
}

export default function AddTaskModal({ onClose, onSubmit }: AddTaskModalProps) {

    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        const result = await onSubmit(title, description, priority);
        if (result) {
            setError(result);
        } else {
            onClose();
        }
    }

    return (
        <>
        
        <div className={styles.BackDiv}>
        <button className={styles.ExitBtn} onClick={() => onClose()}>Back</button>
        <h2>New Task</h2>
        <h3 className={styles.Header}>Task Title</h3>
        <input className={styles.TitleInput} placeholder='Title' onChange={(e) => setTitle(e.target.value)}/>
        <h3 className={styles.Header}>Task Description</h3>
        <textarea className={styles.DescriptionInput} placeholder='Description' onChange={(e) => setDescription(e.target.value)}/>
        <h3 className={styles.Header}>Task Priority</h3>
        
        <div className={styles.PriorityButtons}>
            <button 
                className={`${styles.low} ${priority === 'low' ? styles.active : ''}`}
                onClick={() => setPriority('low')}>Low</button>
            <button 
                className={`${styles.medium} ${priority === 'medium' ? styles.active : ''}`}
                onClick={() => setPriority('medium')}>Medium</button>
            <button 
                className={`${styles.high} ${priority === 'high' ? styles.active : ''}`}
                onClick={() => setPriority('high')}>High</button>
        </div>

        <br/>

        <button className={styles.SubmitBtn} onClick={() => handleSubmit()}>Submit</button>
        <p className={styles.Error}>{error}</p>
        </div>
        
        </>
    )
}