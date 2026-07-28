import styles from '../Styles/StatCard.module.css';
import Icon from './Icon';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'accent' | 'positive' | 'warning' | 'danger';
}

export default function StatCard({ icon, label, value, hint, tone = 'accent' }: StatCardProps) {
  return (
    <div className={styles.card}>
      <span className={`${styles.icon} ${styles[tone]}`}>
        <Icon name={icon} size={20} />
      </span>
      <div>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
        {hint && <p className={styles.hint}>{hint}</p>}
      </div>
    </div>
  );
}
