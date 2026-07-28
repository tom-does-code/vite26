import { Navigate } from 'react-router-dom';
import styles from '../Styles/AppLayout.module.css';
import { useAuth } from '../Context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className={styles.shell} />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
