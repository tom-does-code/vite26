import styles from './styles/settings.module.css';

export default function SettingsForm() {

    return (
        <div className={styles.SettingsBack}>
            <h1 className={styles.Title}>Settings</h1>
            <div className={styles.SettingsBackdrop}>
                

                <ul className={styles.Navbar}>
                    <li className={styles.UserButtonNav}><button className={styles.UserButtonNav}></button></li>
                </ul>
            </div>
        </div>
    )
}