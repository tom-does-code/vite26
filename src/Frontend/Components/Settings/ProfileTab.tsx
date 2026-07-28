import { useEffect, useState } from 'react';
import form from '../../Styles/Form.module.css';
import styles from '../../Styles/SettingsPage.module.css';
import Icon from '../Icon';
import { api } from '../../Api/Client';
import type { Profile } from '../../Api/Types';
import { formatDate } from '../../Utils/Format';
import { useToast } from '../../Context/ToastContext';

export default function ProfileTab() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [bio, setBio] = useState('');
  const [busy, setBusy] = useState(false);

  const { notify } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.get<Profile>('/profile');
        setProfile(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setContactEmail(data.contactEmail);
        setBio(data.bio);
      } catch (err) {
        notify(err instanceof Error ? err.message : 'Could not load your profile.', 'error');
      }
    };

    const timer = setTimeout(loadProfile, 0);
    return () => clearTimeout(timer);
  }, [notify]);

  const save = async () => {
    setBusy(true);

    try {
      await api.put<Profile>('/profile', { firstName, lastName, contactEmail, bio });
      notify('Profile saved.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not save your profile.', 'error');
    }

    setBusy(false);
  };

  const initials = `${firstName.slice(0, 1)}${lastName.slice(0, 1)}`.toUpperCase();

  return (
    <section className={styles.card}>
      <div className={styles.profileHead}>
        <span className={styles.bigAvatar}>{initials || <Icon name="person" size={26} />}</span>
        <div>
          <h2 className={styles.cardTitle}>
            {firstName || lastName ? `${firstName} ${lastName}`.trim() : profile?.username}
          </h2>
          <p className={styles.cardSubtitle}>
            {profile ? `Member since ${formatDate(profile.memberSince)}` : 'Loading your details'}
          </p>
        </div>
      </div>

      <div className={form.row}>
        <div className={form.field}>
          <label className={form.label} htmlFor="first-name">
            First name
          </label>
          <input
            id="first-name"
            className={form.input}
            value={firstName}
            maxLength={40}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Ada"
          />
        </div>

        <div className={form.field}>
          <label className={form.label} htmlFor="last-name">
            Last name
          </label>
          <input
            id="last-name"
            className={form.input}
            value={lastName}
            maxLength={40}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Lovelace"
          />
        </div>
      </div>

      <div className={form.field}>
        <label className={form.label} htmlFor="contact-email">
          Contact email
        </label>
        <input
          id="contact-email"
          className={form.input}
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <span className={form.hint}>Shown on your profile. Your login email lives under Account.</span>
      </div>

      <div className={form.field}>
        <label className={form.label} htmlFor="bio">
          About you
        </label>
        <textarea
          id="bio"
          className={form.textarea}
          value={bio}
          maxLength={400}
          onChange={(e) => setBio(e.target.value)}
          placeholder="A couple of lines about what you are working on"
        />
        <span className={form.hint}>{bio.length} of 400 characters</span>
      </div>

      <div className={styles.actions}>
        <button className={`${form.button} ${form.primary}`} onClick={save} disabled={busy}>
          {busy ? 'Saving' : 'Save changes'}
        </button>
      </div>
    </section>
  );
}
