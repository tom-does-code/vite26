import styles from '../../Styles/SettingsPage.module.css';
import Icon from '../Icon';
import { usePreferences } from '../../Context/PreferencesContext';
import { useToast } from '../../Context/ToastContext';

const accents = [
  { value: 'violet', label: 'Violet', colour: '#7c5cff' },
  { value: 'teal', label: 'Teal', colour: '#21b8a6' },
  { value: 'amber', label: 'Amber', colour: '#e0952f' },
  { value: 'rose', label: 'Rose', colour: '#eb5f8a' }
];

const themes = [
  { value: 'dark', label: 'Dark', icon: 'dark_mode' },
  { value: 'light', label: 'Light', icon: 'light_mode' }
];

export default function AppearanceTab() {
  const { preferences, savePreferences } = usePreferences();
  const { notify } = useToast();

  const update = async (changes: Partial<typeof preferences>) => {
    try {
      await savePreferences({ ...preferences, ...changes });
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not save your preferences.', 'error');
    }
  };

  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Appearance</h2>
      <p className={styles.cardSubtitle}>Changes apply straight away and are saved to your account.</p>

      <div className={styles.divider} />

      <h3 className={styles.groupLabel}>Theme</h3>
      <div className={styles.themeRow}>
        {themes.map((theme) => (
          <button
            key={theme.value}
            className={
              preferences.theme === theme.value
                ? `${styles.themeOption} ${styles.optionActive}`
                : styles.themeOption
            }
            onClick={() => update({ theme: theme.value })}
          >
            <span className={`${styles.themePreview} ${styles[theme.value]}`}>
              <Icon name={theme.icon} size={20} />
            </span>
            {theme.label}
          </button>
        ))}
      </div>

      <h3 className={styles.groupLabel}>Accent colour</h3>
      <div className={styles.accentRow}>
        {accents.map((accent) => (
          <button
            key={accent.value}
            className={
              preferences.accentColour === accent.value
                ? `${styles.accentOption} ${styles.optionActive}`
                : styles.accentOption
            }
            onClick={() => update({ accentColour: accent.value })}
          >
            <span className={styles.swatch} style={{ backgroundColor: accent.colour }}>
              {preferences.accentColour === accent.value && <Icon name="check" size={16} />}
            </span>
            {accent.label}
          </button>
        ))}
      </div>
    </section>
  );
}
