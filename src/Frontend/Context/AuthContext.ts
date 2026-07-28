import { createContext, useContext } from 'react';
import type { CurrentUser } from '../Api/Types';

export interface AuthValue {
  user: CurrentUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthValue | null>(null);

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth has to be used inside an AuthProvider.');
  }

  return value;
}
