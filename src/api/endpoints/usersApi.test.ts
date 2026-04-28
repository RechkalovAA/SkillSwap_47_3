/**
 * @jest-environment jsdom
 */
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  normalizeEmail,
  appendUserToMockDb,
  MOCK_USERS_DB_STORAGE_KEY,
} from './usersApi';
import type { User } from '../../entities/user/model/types';
import { loadJson } from './loadJson';

// Мокаем loadJson
jest.mock('./loadJson', () => ({
  loadJson: jest.fn(),
}));

describe('usersApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Очищаем localStorage перед каждым тестом (детерминированность)
    localStorage.removeItem(MOCK_USERS_DB_STORAGE_KEY);
  });

  describe('normalizeEmail', () => {
    it('должна очищать от пробелов и переводить в нижний регистр', () => {
      expect(normalizeEmail('  Test@MAIL.com  ')).toBe('test@mail.com');
      expect(normalizeEmail('JOHN.DOE@example.ORG')).toBe(
        'john.doe@example.org',
      );
    });
  });

  describe('appendUserToMockDb', () => {
    const mockJsonUsers = [
      { id: 'json-1', email: 'json@test.com', name: 'Json User' },
    ] as User[];

    const testUser = {
      id: 'test-1',
      email: 'test@example.com',
      name: 'Test User',
      password: 'password',
      birthDate: '1990-01-01',
      age: 33,
      gender: 'мужской' as const,
      createdAt: new Date().toISOString(),
      avatar: 'avatar.jpg',
      skills: [],
      skillCanTeach: [
        {
          id: 'skill-1',
          categoryId: 'cat-1',
          name: 'Test Skill',
          description: 'Test description',
          length: 0, // ← добавляем обязательное поле length
        },
      ],
    } as User;

    beforeEach(() => {
      (loadJson as jest.MockedFunction<typeof loadJson>).mockResolvedValue({
        users: mockJsonUsers,
      });
    });

    it('должна успешно записывать пользователя со всем уникальным email в localStorage', async () => {
      const result = await appendUserToMockDb(testUser);

      expect(result).toEqual({ ok: true });

      // Проверяем, что в LS записался пользователь с нормализованным email
      const lsData = JSON.parse(
        localStorage.getItem(MOCK_USERS_DB_STORAGE_KEY) || '[]',
      );
      expect(lsData).toHaveLength(1);
      expect(lsData[0].email).toBe('new@test.com');
      expect(lsData[0].name).toBe('New User');
    });

    it('должна возвращать EMAIL_TAKEN, если email конфликтует с базой JSON', async () => {
      const duplicateUser = { ...testUser, email: ' JSON@test.com ' } as User; // Тот же email, другой регистр/пробелы
      const result = await appendUserToMockDb(duplicateUser);

      expect(result).toEqual({ ok: false, error: 'EMAIL_TAKEN' });

      const lsData = localStorage.getItem(MOCK_USERS_DB_STORAGE_KEY);
      expect(lsData).toBeNull(); // Ничего не записали
    });

    it('должна возвращать EMAIL_TAKEN, если email конфликтует с localStorage моками', async () => {
      // Предзаполним LS другим пользователем
      localStorage.setItem(
        MOCK_USERS_DB_STORAGE_KEY,
        JSON.stringify([{ ...testUser, email: 'new@test.com' }]),
      );

      const duplicateUser = { ...testUser, email: '  NEW@test.com  ' } as User;
      const result = await appendUserToMockDb(duplicateUser);

      expect(result).toEqual({ ok: false, error: 'EMAIL_TAKEN' });

      // В LS по-прежнему должен лежать только 1 пользователь
      const lsData = JSON.parse(
        localStorage.getItem(MOCK_USERS_DB_STORAGE_KEY) || '[]',
      );
      expect(lsData).toHaveLength(1);
    });
  });
});
