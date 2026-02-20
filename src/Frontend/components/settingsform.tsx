import styles from './styles/settings.module.css';
import { useState } from 'react';

import ProfileTab from './settingsprofile';

export default function SettingsForm() {
    const [activePage, setActivePage] = useState('profile');

    return (
        <div className={styles.SettingsBack}>
            <h1 className={styles.Title}>Settings</h1>
            <div className={styles.SettingsBackdrop}>
                

                <div className={styles.NavbarBack}>
                    <ul className={styles.Navbar}>
                        <li className={styles.UserButtonNav} onClick={() => setActivePage('profile')}><a>Profile</a></li>
                        <li className={styles.UserButtonNav} onClick={() => setActivePage('account')}><a>Account</a></li>
                        <li className={styles.UserButtonNav} onClick={() => setActivePage('appearance')}><a>Appearance</a></li>
                        <li className={styles.UserButtonNav} onClick={() => setActivePage('tasks')}><a>Tasks</a></li>
                    </ul>
                </div>
            </div>

            {activePage === 'profile' && (
                <ProfileTab></ProfileTab>
            )}

            {activePage === 'account' && (
                <h1>b</h1>
            )}
            
            {activePage === 'appearance' && (
                <h1>c</h1>
            )}

            
            {activePage === 'tasks' && (
                <h1>d</h1>
            )}

        </div>
    )
}