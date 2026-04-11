import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { loginWithUsersJson } from './api/authenticate';
import type { AuthUser } from './model/types';
import {
  clearStoredAuthUser,
  readStoredAuthUser,
  writeStoredAuthUser,
} from './lib/authStorage';

type AuthContextValue = {
  user: AuthUser | null;
  isAuth: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(readStoredAuthUser());
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const next = await loginWithUsersJson(email.trim(), password);
      if (!next) {
        return false;
      }
      setUser(next);
      writeStoredAuthUser(next);
      return true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Login failed:', e);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearStoredAuthUser();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuth: Boolean(user),
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
