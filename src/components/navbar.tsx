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
                        <li><Link to="/Home">Home</Link></li>
                    </ul>
                </nav>
            )}
        </div>
        
        </>
    )
}