import styles from '../../Styles/SettingsPage.module.css';
import { usePreferences } from '../../Context/PreferencesContext';
import { useToast } from '../../Context/ToastContext';

const priorities = ['low', 'medium', 'high'];

export default function TaskPreferencesTab() {
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
      <h2 className={styles.cardTitle}>Task defaults</h2>
      <p className={styles.cardSubtitle}>Small things that make adding tasks quicker.</p>

      <div className={styles.divider} />

      <h3 className={styles.groupLabel}>Default priority for new tasks</h3>
      <div className={styles.priorityRow}>
        {priorities.map((value) => (
          <button
            key={value}
            className={
              preferences.defaultPriority === value
                ? `${styles.priorityOption} ${styles.optionActive}`
                : styles.priorityOption
            }
            onClick={() => update({ defaultPriority: value })}
          >
            {value}
          </button>
        ))}
      </div>

      <div className={styles.toggleRow}>
        <div>
          <p className={styles.toggleLabel}>Ask before deleting</p>
          <p className={styles.cardSubtitle}>
            Show a confirmation step when removing a task or budget entry.
          </p>
        </div>

        <button
          role="switch"
          aria-checked={preferences.confirmBeforeDelete}
          className={
            preferences.confirmBeforeDelete ? `${styles.toggle} ${styles.toggleOn}` : styles.toggle
          }
          onClick={() => update({ confirmBeforeDelete: !preferences.confirmBeforeDelete })}
        >
          <span className={styles.knob} />
        </button>
      </div>
    </section>
  );
}
