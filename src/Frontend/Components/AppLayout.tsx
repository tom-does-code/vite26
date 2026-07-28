import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from '../Styles/AppLayout.module.css';
import Sidebar from './Sidebar';
import Icon from './Icon';

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className={styles.main}>
        <button className={styles.menuButton} onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Icon name="menu" size={22} />
        </button>

        <Outlet />
      </main>
    </div>
  );
}
