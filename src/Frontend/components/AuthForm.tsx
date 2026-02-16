import { useState } from 'react';
import styles from './styles/loginform.module.css';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
    const [isLogin, setIsLogin] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const TryLogin = async (username: string, password: string) => {
        const res = await fetch('http://localhost:8080/Backend/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password })
            }
        )
        const data = await res.json();

        if (data.success) {
            localStorage.setItem('token', data.token)
            navigate('/management');
        } else {
            console.log('error invalid user');
        }
    }

    const TrySignUp = async (email: string, username: string, password: string) => {
        if (email && username && password) {
            const res = await fetch('http://localhost:8080/Backend/createaccount.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({email, username, password})
        })

        const data = await res.json();

        if (data.success) {
            localStorage.setItem('token', data.token)
            navigate('/management');
        } else {
            alert('Unknown Issue');
            return;
        }}
    }

    return (
        <>
        {isLogin ? (
            <div className={styles.LoginContainer}>
                <h2>Username</h2>
                <input className="usernameInput" onChange={(e) => setUsername(e.target.value)} placeholder='Password'/>
                <h2>Password</h2>
                <input className="passwordInput" type="password" onChange={(e) => setPassword(e.target.value)} placeholder='Password'/>
                <br></br>
                <button className={styles.loginButton} onClick={() => TryLogin( username, password)}>Login</button>
                <p className={styles.toggleLogin}><span onClick={() => setIsLogin(!isLogin)}>Don't have an account? Sign Up</span></p>
            </div>
        ) : (
                <div className={styles.SignupContainer}>
                <h2>Email</h2>
                <input className="signup_emailInput" onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
                <h2>Username</h2>
                <input className="signup_usernameInput" onChange={(e) => setUsername(e.target.value)} placeholder='Password'/>
                <h2>Password</h2>
                <input className="signup_passwordInput" type="password" onChange={(e) => setPassword(e.target.value)} placeholder='Password'/>
                <br/>
                <button className={styles.loginButton} onClick={() => TrySignUp( email, username, password)}>Sign Up</button>
                <p className={styles.toggleLogin}><span onClick={() => setIsLogin(!isLogin)}>Already have an account? Log In</span></p>
            </div>
        )}
            <br/>
        <br/>
        </>
    )
}