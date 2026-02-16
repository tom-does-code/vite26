import styles from'./styles/navbar.module.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [navbarActive, setNavbarActive] = useState(true);

    return (
        <>
        
        <div className={styles.navDiv}>
            <button className={styles.togglenav} onClick={() => setNavbarActive(!navbarActive)}>&#x2630;</button>

            {navbarActive && (
                <nav>
                    <ul>
                        <li className={styles.logoutbtn}><Link to="/">Log Out</Link></li>
                        <li><Link to="/management">Management</Link></li>
                        <li><Link to="/budgetmanager">Budget Manager</Link></li>
                    </ul>
                </nav>
            )}
        </div>
        </>
    )
}