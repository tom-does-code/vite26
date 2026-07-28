import { createContext, useContext } from 'react';
import type { Preferences } from '../Api/Types';

export interface PreferencesValue {
  preferences: Preferences;
  savePreferences: (next: Preferences) => Promise<void>;
}

export const defaultPreferences: Preferences = {
  theme: 'dark',
  accentColour: 'violet',
  defaultPriority: 'medium',
  confirmBeforeDelete: true
};

export const PreferencesContext = createContext<PreferencesValue | null>(null);

export function usePreferences() {
  const value = useContext(PreferencesContext);

  if (!value) {
    throw new Error('usePreferences has to be used inside a PreferencesProvider.');
  }

  return value;
}
