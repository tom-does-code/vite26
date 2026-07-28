import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../Styles/Sidebar.module.css';
import Icon from './Icon';
import { useAuth } from '../Context/AuthContext';

const links = [
  { to: '/tasks', label: 'Tasks', icon: 'checklist' },
  { to: '/stats', label: 'Statistics', icon: 'monitoring' },
  { to: '/budget', label: 'Budget', icon: 'account_balance_wallet' },
  { to: '/settings', label: 'Settings', icon: 'settings' }
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user ? user.username.slice(0, 2).toUpperCase() : '';

  return (
    <>
      {open && <div className={styles.scrim} onClick={onClose} />}

      <aside className={open ? `${styles.sidebar} ${styles.open}` : styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.mark}>
            <Icon name="bolt" size={20} filled />
          </span>
          <span className={styles.brandName}>Momentum</span>
        </div>

        <nav className={styles.nav}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
            >
              <Icon name={link.icon} size={20} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <div className={styles.account}>
            <span className={styles.avatar}>{initials}</span>
            <div className={styles.accountText}>
              <span className={styles.username}>{user?.username}</span>
              <span className={styles.email}>{user?.email}</span>
            </div>
          </div>

          <button className={styles.logout} onClick={handleLogout}>
            <Icon name="logout" size={19} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
