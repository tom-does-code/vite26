import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/AuthPage.module.css';
import form from '../Styles/Form.module.css';
import Icon from '../Components/Icon';
import { useAuth } from '../Context/AuthContext';
import { ApiError } from '../Api/Client';

const highlights = [
  { icon: 'checklist', text: 'Priorities, categories and due dates on every task' },
  { icon: 'monitoring', text: 'Completion streaks and a 14 day activity view' },
  { icon: 'savings', text: 'Monthly income and spending in the same place' }
];

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const isLogin = mode === 'login';

  const switchMode = () => {
    setMode(isLogin ? 'register' : 'login');
    setError('');
  };

  const validate = () => {
    if (!username.trim()) {
      return 'Enter your username.';
    }

    if (!isLogin && username.trim().length < 3) {
      return 'Usernames need at least 3 characters.';
    }

    if (!isLogin && !email.includes('@')) {
      return 'Enter a valid email address.';
    }

    if (!password) {
      return 'Enter your password.';
    }

    if (!isLogin && password.length < 8) {
      return 'Passwords need at least 8 characters.';
    }

    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const problem = validate();

    if (problem) {
      setError(problem);
      return;
    }

    setBusy(true);
    setError('');

    try {
      if (isLogin) {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), email.trim(), password);
      }

      navigate('/tasks');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not reach the server.');
      setBusy(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.pitch}>
        <div className={styles.brand}>
          <span className={styles.mark}>
            <Icon name="bolt" size={22} filled />
          </span>
          Momentum
        </div>

        <h1 className={styles.pitchTitle}>Everything you meant to get done, in one place.</h1>
        <p className={styles.pitchText}>
          Momentum keeps your tasks, your progress and your monthly budget together so you can see
          what actually moved this week.
        </p>

        <ul className={styles.highlights}>
          {highlights.map((item) => (
            <li key={item.icon}>
              <span className={styles.highlightIcon}>
                <Icon name={item.icon} size={19} />
              </span>
              {item.text}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.formSide}>
        <form className={styles.card} onSubmit={handleSubmit}>
          <h2 className={styles.cardTitle}>{isLogin ? 'Welcome back' : 'Create your account'}</h2>
          <p className={styles.cardSubtitle}>
            {isLogin ? 'Log in to pick up where you left off.' : 'It takes about ten seconds.'}
          </p>

          {error && (
            <div className={form.error}>
              <Icon name="error" size={17} />
              {error}
            </div>
          )}

          <div className={form.field}>
            <label className={form.label} htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className={form.input}
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourname"
            />
          </div>

          {!isLogin && (
            <div className={form.field}>
              <label className={form.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className={form.input}
                type="email"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          )}

          <div className={form.field}>
            <label className={form.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className={form.input}
              type="password"
              value={password}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? 'Your password' : 'At least 8 characters'}
            />
          </div>

          <button className={`${form.button} ${form.primary} ${styles.submit}`} disabled={busy}>
            {busy ? 'Please wait' : isLogin ? 'Log in' : 'Sign up'}
          </button>

          <p className={styles.switch}>
            {isLogin ? "Don't have an account?" : 'Already registered?'}
            <button type="button" onClick={switchMode}>
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </form>
      </section>
    </div>
  );
}
