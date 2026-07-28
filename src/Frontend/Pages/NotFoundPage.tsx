import { Link } from 'react-router-dom';
import styles from '../Styles/NotFoundPage.module.css';
import form from '../Styles/Form.module.css';
import Icon from '../Components/Icon';

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <span className={styles.icon}>
        <Icon name="explore_off" size={30} />
      </span>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>That page does not exist, or it moved somewhere else.</p>
      <Link className={`${form.button} ${form.primary}`} to="/tasks">
        Back to your tasks
      </Link>
    </div>
  );
}
