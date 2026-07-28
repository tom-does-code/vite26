import { useState } from 'react';
import styles from '../Styles/SettingsPage.module.css';
import PageHeader from '../Components/PageHeader';
import Icon from '../Components/Icon';
import ProfileTab from '../Components/Settings/ProfileTab';
import AccountTab from '../Components/Settings/AccountTab';
import AppearanceTab from '../Components/Settings/AppearanceTab';
import TaskPreferencesTab from '../Components/Settings/TaskPreferencesTab';

const tabs = [
  { value: 'profile', label: 'Profile', icon: 'person' },
  { value: 'account', label: 'Account', icon: 'shield_person' },
  { value: 'appearance', label: 'Appearance', icon: 'palette' },
  { value: 'tasks', label: 'Task defaults', icon: 'tune' }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <>
      <PageHeader title="Settings" subtitle="Your details, your look, your defaults." />

      <div className={styles.layout}>
        <nav className={styles.tabList}>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={activeTab === tab.value ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              onClick={() => setActiveTab(tab.value)}
            >
              <Icon name={tab.icon} size={19} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className={styles.content}>
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'account' && <AccountTab />}
          {activeTab === 'appearance' && <AppearanceTab />}
          {activeTab === 'tasks' && <TaskPreferencesTab />}
        </div>
      </div>
    </>
  );
}
