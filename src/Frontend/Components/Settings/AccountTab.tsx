import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import form from '../../Styles/Form.module.css';
import styles from '../../Styles/SettingsPage.module.css';
import ConfirmDialog from '../ConfirmDialog';
import { api } from '../../Api/Client';
import { useAuth } from '../../Context/AuthContext';
import { useToast } from '../../Context/ToastContext';
import { formatDate } from '../../Utils/Format';

export default function AccountTab() {
  const { user, logout } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const saveEmail = async () => {
    try {
      await api.put('/account/email', { email });
      notify('Login email updated.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not update your email.', 'error');
    }
  };

  const savePassword = async () => {
    if (newPassword.length < 8) {
      notify('New passwords need at least 8 characters.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      notify('The two new passwords do not match.', 'error');
      return;
    }

    try {
      await api.put('/account/password', { currentPassword, newPassword });
      notify('Password changed.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not change your password.', 'error');
    }
  };

  const deleteAccount = async () => {
    try {
      await api.remove('/account');
      logout();
      navigate('/');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not delete your account.', 'error');
      setConfirmingDelete(false);
    }
  };

  return (
    <>
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Account</h2>
        <p className={styles.cardSubtitle}>
          Signed in as {user?.username}, joined {formatDate(user?.createdAt ?? null)}.
        </p>

        <div className={styles.divider} />

        <div className={form.field}>
          <label className={form.label} htmlFor="login-email">
            Login email
          </label>
          <input
            id="login-email"
            className={form.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <button
            className={`${form.button} ${form.primary}`}
            onClick={saveEmail}
            disabled={!email || email === user?.email}
          >
            Update email
          </button>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Change password</h2>
        <p className={styles.cardSubtitle}>You will stay logged in on this device.</p>

        <div className={styles.divider} />

        <div className={form.field}>
          <label className={form.label} htmlFor="current-password">
            Current password
          </label>
          <input
            id="current-password"
            className={form.input}
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className={form.row}>
          <div className={form.field}>
            <label className={form.label} htmlFor="new-password">
              New password
            </label>
            <input
              id="new-password"
              className={form.input}
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className={form.field}>
            <label className={form.label} htmlFor="confirm-password">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              className={form.input}
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={`${form.button} ${form.primary}`}
            onClick={savePassword}
            disabled={!currentPassword || !newPassword || !confirmPassword}
          >
            Change password
          </button>
        </div>
      </section>

      <section className={`${styles.card} ${styles.dangerCard}`}>
        <h2 className={styles.cardTitle}>Delete account</h2>
        <p className={styles.cardSubtitle}>
          This wipes your tasks, budget entries and profile. It cannot be undone.
        </p>

        <div className={styles.actions}>
          <button className={`${form.button} ${form.danger}`} onClick={() => setConfirmingDelete(true)}>
            Delete my account
          </button>
        </div>
      </section>

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete your account?"
          message="Everything you have saved in Momentum will be removed straight away."
          confirmLabel="Delete everything"
          onConfirm={deleteAccount}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </>
  );
}
