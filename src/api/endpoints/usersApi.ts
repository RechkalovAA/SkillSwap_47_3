// src/api/endpoints/usersApi.ts
import type { User } from '../../entities/user/model/types';
import { loadJson } from './loadJson';
import { saveSkillToMockDb, type MockSkill } from './skillsApi';
import type { SkillTeach } from '../../entities/skill/model/types';

type UsersResponse = {
  users: RawUser[];
};

// Сырой тип из JSON (старый формат)
type RawUser = Omit<User, 'skillCanTeach'> & {
  skillCanTeach?: SkillTeach | SkillTeach[];
};

// Нормализует skillCanTeach в массив (без вложенных тернарников)
function normalizeUser(rawUser: RawUser): User {
  let skillCanTeach: SkillTeach[] = [];

  if (Array.isArray(rawUser.skillCanTeach)) {
    skillCanTeach = rawUser.skillCanTeach;
  } else if (rawUser.skillCanTeach) {
    skillCanTeach = [rawUser.skillCanTeach];
  }

  return {
    ...rawUser,
    skillCanTeach,
  };
}

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

// Единая функция getAllUsers (удаляем дубликат)
export const getAllUsers = async (): Promise<User[]> => {
  const data = await loadJson<UsersResponse>('/db/users.json');
  const staticUsers = data.users.map(normalizeUser);
  const mockUsers = readMockUsersDb().map(normalizeUser);
  return [...staticUsers, ...mockUsers];
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

export function updateUserProfileInMockDb(
  userId: string,
  patch: Partial<Omit<User, 'password'>>,
): boolean {
  const mockUsers = readMockUsersDb();
  const index = mockUsers.findIndex((item) => item.id === userId);
  if (index === -1) {
    return false;
  }

  mockUsers[index] = { ...mockUsers[index], ...patch };
  writeMockUsersDb(mockUsers);
  return true;
}

export { normalizeEmail };

// getUserBySkillId — теперь ищет в массиве
export const getUserBySkillId = async (
  skillId: string,
  excludeUserId?: string,
): Promise<User | null> => {
  const users = await getAllUsers();
  const user = users.find(
    (u) =>
      u.skillCanTeach?.some((skill) => skill.id === skillId) &&
      u.id !== excludeUserId,
  );
  return user || null;
};

// getUsersBySkillId — возвращает массив
export const getUsersBySkillId = async (
  skillId: string,
  excludeUserId?: string,
): Promise<User[]> => {
  const users = await getAllUsers();
  return users.filter(
    (u) =>
      u.skillCanTeach?.some((skill) => skill.id === skillId) &&
      u.id !== excludeUserId,
  );
};

// Поиск по ID пользователя
export const getUserById = async (userId: string): Promise<User | null> => {
  const users = await getAllUsers();
  return users.find((user) => user.id === userId) || null;
};

export async function updateUserInMockDb(
  userId: string,
  updates: Partial<Omit<User, 'id' | 'email' | 'password'>>,
): Promise<boolean> {
  try {
    const mockUsers = readMockUsersDb();
    const index = mockUsers.findIndex((user) => user.id === userId);

    if (index === -1) return false;

    // Частичное обновление: не заменяем всего пользователя, а только указанные поля
    mockUsers[index] = { ...mockUsers[index], ...updates };
    writeMockUsersDb(mockUsers);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Сохраняет новый навык в отдельное хранилище и обновляет пользователя
 * Использует частичное обновление через updateUserInMockDb
 */
export async function addSkillToUser(
  userId: string,
  newSkill: {
    id: string;
    categoryId: string;
    name: string;
    description: string;
    image?: string;
    tags?: string[];
  },
  subcategoryIdToLearn?: string,
): Promise<boolean> {
  try {
    // 1. Сохраняем навык в отдельное хранилище
    const skillToSave: MockSkill = {
      id: newSkill.id,
      categoryId: newSkill.categoryId,
      name: newSkill.name,
      description: newSkill.description,
      tags: newSkill.tags || [],
      image: newSkill.image,
      createdAt: new Date().toISOString(),
      userId,
    };

    await saveSkillToMockDb(skillToSave);

    // 2. Получаем текущего пользователя
    const currentUser = await getUserById(userId);
    if (!currentUser) return false;

    // 3. Обновляем массив навыков пользователя
    const existingSkills = currentUser.skillCanTeach || [];
    const updates: Partial<Omit<User, 'id' | 'email' | 'password'>> = {
      skillCanTeach: [
        ...existingSkills,
        {
          id: newSkill.id,
          categoryId: newSkill.categoryId,
          name: newSkill.name,
          description: newSkill.description,
          length: 0,
        },
      ],
    };

    // Если нужно добавить навык в список "хочет научиться"
    if (subcategoryIdToLearn) {
      updates.skills = [...(currentUser.skills || []), subcategoryIdToLearn];
    }

    // Если есть изображение
    if (newSkill.image) {
      updates.images = [...(currentUser.images || []), newSkill.image];
    }

    // 4. Обновляем пользователя в MockDb
    return await updateUserInMockDb(userId, updates);
  } catch (error) {
    console.error('Error adding skill to user:', error);
    return false;
  }
}

/**
 * @deprecated Используйте addSkillToUser вместо этой функции
 * Эта функция полностью заменяет пользователя, что может привести к потере данных
 */
export async function appendSkillToMockDb(updatedUser: User): Promise<boolean> {
  try {
    const mockUsers = readMockUsersDb();
    const index = mockUsers.findIndex((item) => item.id === updatedUser.id);

    if (index !== -1) {
      mockUsers[index] = updatedUser;
      writeMockUsersDb(mockUsers);
    }

    return true;
  } catch (error) {
    return false;
  }
}
