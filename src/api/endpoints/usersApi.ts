import type { User } from '../../entities/user/model/types';
import { loadJson } from './loadJson';

type UsersResponse = {
  users: User[];
};

// localStorage mock DB for users created in the client during registration flow.
// Format is a JSON-serialized array of full User objects.
export const MOCK_USERS_DB_STORAGE_KEY = 'mock_users_db';

export type MockUsersDb = User[];

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function readMockUsersDb(): MockUsersDb {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = localStorage.getItem(MOCK_USERS_DB_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as MockUsersDb;
  } catch {
    localStorage.removeItem(MOCK_USERS_DB_STORAGE_KEY);
    return [];
  }
}

function writeMockUsersDb(users: MockUsersDb): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(MOCK_USERS_DB_STORAGE_KEY, JSON.stringify(users));
}

export const getAllUsers = async (): Promise<User[]> => {
  const data = await loadJson<UsersResponse>('/db/users.json');
  // Merge order is fixed: bundled mock JSON first, then localStorage users.
  // This keeps the seed dataset stable and makes newly registered mock users
  // visible through the same path loginWithUsersJson uses.
  return [...data.users, ...readMockUsersDb()];
};

export async function appendUserToMockDb(
  user: User,
): Promise<{ ok: true } | { ok: false; error: 'EMAIL_TAKEN' }> {
  const normalizedEmail = normalizeEmail(user.email);
  const users = await getAllUsers();
  const hasDuplicate = users.some(
    (existingUser) => normalizeEmail(existingUser.email) === normalizedEmail,
  );

  if (hasDuplicate) {
    return {
      ok: false,
      error: 'EMAIL_TAKEN',
    };
  }

  const mockUsers = readMockUsersDb();
  mockUsers.push({
    ...user,
    email: normalizedEmail,
  });
  writeMockUsersDb(mockUsers);

  return {
    ok: true,
  };
}

export { normalizeEmail };
// Получить пользователя по ID навыка
export const getUserBySkillId = async (
  skillId: string,
): Promise<User | null> => {
  const users = await getAllUsers();
  const user = users.find((u) => u.skillCanTeach?.id === skillId);
  return user || null;
};

// Получить всех пользователей с таким же навыком (исключая указанного)
export const getUsersBySkillId = async (
  skillId: string,
  excludeUserId?: string,
): Promise<User[]> => {
  const users = await getAllUsers();
  return users.filter(
    (u) => u.skillCanTeach?.id === skillId && u.id !== excludeUserId,
  );
};
