import { AuthUser } from '../model/types';

export const AUTH_STORAGE_KEY = 'skillswap_auth_user';

export function readStoredAuthUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function writeStoredAuthUser(user: AuthUser): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredAuthUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
