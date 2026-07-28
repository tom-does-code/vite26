import styles from '../Styles/EmptyState.module.css';
import Icon from './Icon';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <div className={styles.iconRing}>
        <Icon name={icon} size={30} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {action}
    </div>
  );
}
