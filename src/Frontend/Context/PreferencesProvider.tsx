import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../Api/Client';
import type { Preferences } from '../Api/Types';
import { useAuth } from './AuthContext';
import { PreferencesContext, defaultPreferences } from './PreferencesContext';

export default function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) {
        setPreferences(defaultPreferences);
        return;
      }

      try {
        setPreferences(await api.get<Preferences>('/profile/preferences'));
      } catch {
        setPreferences(defaultPreferences);
      }
    };

    const timer = setTimeout(loadPreferences, 0);
    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.dataset.accent = preferences.accentColour;
  }, [preferences.theme, preferences.accentColour]);

  const savePreferences = useCallback(async (next: Preferences) => {
    setPreferences(next);
    await api.put<Preferences>('/profile/preferences', next);
  }, []);

  const value = useMemo(() => ({ preferences, savePreferences }), [preferences, savePreferences]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
