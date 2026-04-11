import type { User } from '../../../entities/user/model/types';
import type { SkillTeach } from '../../../entities/skill/model/types';
import {
  appendUserToMockDb,
  getAllUsers,
  normalizeEmail,
} from '../../../api/endpoints/usersApi';

type RegisterMockUserInput = {
  email: string;
  password: string;
  name?: string;
  birthDate?: string;
  gender?: User['gender'];
  city?: string;
  skillToLearnId?: string;
  skillCanTeach?: SkillTeach;
  about?: string;
};

type RegisterMockUserResult =
  | {
      ok: true;
      user: User;
    }
  | {
      ok: false;
      error: 'EMAIL_TAKEN';
    };

function calculateAge(birthDate?: string): number {
  if (!birthDate) {
    return 18;
  }

  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) {
    return 18;
  }

  const now = new Date();
  let age = now.getFullYear() - date.getFullYear();
  const monthDiff = now.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) {
    age -= 1;
  }

  return age;
}

export async function isRegistrationEmailTaken(
  email: string,
): Promise<boolean> {
  const normalizedEmail = normalizeEmail(email);
  const users = await getAllUsers();

  return users.some((user) => normalizeEmail(user.email) === normalizedEmail);
}

function createMockUser({
  email,
  password,
  name,
  birthDate,
  gender,
  city,
  skillToLearnId,
  skillCanTeach,
  about,
}: RegisterMockUserInput): User {
  const now = new Date();
  const normalizedEmail = email.trim().toLowerCase();
  const emailName = normalizedEmail.split('@')[0] || 'user';
  const displayName =
    name?.trim() ||
    emailName.charAt(0).toUpperCase() +
      emailName.slice(1).replace(/[._-]+/g, ' ');

  return {
    id: `user_mock_${crypto.randomUUID()}`,
    name: displayName,
    email: normalizedEmail,
    password,
    avatar: '1.jpg',
    city,
    birthDate: birthDate || '2000-01-01',
    age: calculateAge(birthDate),
    gender: gender || 'женский',
    createdAt: now.toISOString(),
    favorites: [],
    liked_me: [],
    skillCanTeach: skillCanTeach || {
      id: 'skill_mock_001',
      categoryId: '0',
      name: 'Новый навык',
      description: 'Пока не заполнено',
    },
    images: [],
    skills: skillToLearnId ? [skillToLearnId] : [],
    about: about || '',
  };
}

export async function registerMockUser(
  input: RegisterMockUserInput,
): Promise<RegisterMockUserResult> {
  const normalizedEmail = normalizeEmail(input.email);

  const user = createMockUser({
    ...input,
    email: normalizedEmail,
  });

  const appendResult = await appendUserToMockDb(user);
  if (!appendResult.ok) {
    return appendResult;
  }

  return {
    ok: true,
    user,
  };
}
