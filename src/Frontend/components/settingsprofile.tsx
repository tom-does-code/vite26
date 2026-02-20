import styles from './styles/profiletab.module.css';
import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

export default function ProfileTab() {
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);
    const [firstEmail, setEmail] = useState<string | null>(null);
    const [aboutMe, setAboutMe] = useState<string | null>(null);

    const navigate = useNavigate();

    const [message, setMessage] = useState('');
    
    const SubmitData = async () => {
        if (firstName && lastName && firstEmail && aboutMe) {
            const sessionToken = localStorage.getItem('token');
            if (!sessionToken) {return navigate('/')}

            const res = await fetch('http://localhost:8080/Backend/setuserprofile.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({sessionToken, firstName, lastName, firstEmail, aboutMe})
            })

            const data = await res.json();

            if (data.success) {
                setMessage('Changes saved!');
            } else {
                setMessage('Something went wrong.');
            }
        } else {
            setMessage('Please fill in all fields.');
        }
        setTimeout(() => setMessage(''), 3000);
    }

    useEffect(() => {
        const fetchData = async () => {
            const sessionToken = localStorage.getItem('token');
            if (!sessionToken) {return navigate('/')}

            const res = await fetch('http://localhost:8080/Backend/retrieveuserprofile.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({sessionToken})
            })

            const data = await res.json();

            if (data.success) {
                setFirstName(data.data.first_name);
                setLastName(data.data.last_name);
                setEmail(data.data.email);
                setAboutMe(data.data.bio);
            } else {
                console.log('No Data');
            };
        };
        fetchData();
    }, []);

    return (
        <>
        <div className={styles.ProfileDiv}>
            <h2 className={styles.ProfileTitle}>Profile</h2>

            <div className={styles.profileFields}>
                <div className={styles.FirstNameSection}>
                    <h2 className={styles.ValueTitle}>First Name</h2>
                    <input className={styles.FirstNameInput} onChange={(e) => setFirstName(e.target.value)} placeholder='First Name' value={firstName ?? ''}/>
                </div>

                <div className={styles.LastNameSection}>
                    <h2 className={styles.ValueTitle}>Last Name</h2>
                    <input className={styles.LastNameInput} onChange={(e) => setLastName(e.target.value)} placeholder='Last Name' value={lastName ?? ''}/>
                </div>
            </div>

            <div className={styles.EmailSection}>
                <h2 className={styles.ValueTitle}>Email</h2>
                <input className={styles.EmailInput} onChange={(e) => setEmail(e.target.value)} placeholder='Email' value={firstEmail ?? ''}/>
            </div>

            <div className={styles.BioSection}>
                <h2 className={styles.ValueTitle}>About Me</h2>
                <textarea className={styles.BioInput} onChange={(e) => setAboutMe(e.target.value)} placeholder='About Me' value={aboutMe ?? ''}/>
            </div>
            
            {message && <p className={styles.Message}>{message}</p>}
            <button className={styles.SaveButton} onClick={() => SubmitData()}>Save Changes</button>
        </div>
        </>
    )
}