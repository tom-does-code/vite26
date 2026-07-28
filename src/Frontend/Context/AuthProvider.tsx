import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, clearToken, getToken, saveToken } from '../Api/Client';
import type { CurrentUser } from '../Api/Types';
import { AuthContext } from './AuthContext';

interface AuthResponse {
  token: string;
  username: string;
  expiresAt: string;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        setUser(await api.get<CurrentUser>('/auth/me'));
      } catch {
        clearToken();
      }

      setLoading(false);
    };

    const timer = setTimeout(restoreSession, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/login', { username, password });
    saveToken(res.token);
    setUser(await api.get<CurrentUser>('/auth/me'));
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/register', { username, email, password });
    saveToken(res.token);
    setUser(await api.get<CurrentUser>('/auth/me'));
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
