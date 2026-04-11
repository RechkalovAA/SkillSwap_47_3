import type { User } from '../../../entities/user/model/types';
import type { SkillTeach } from '../../../entities/skill/model/types';

export const REGISTER_DRAFT_STORAGE_KEY = 'skillswap_register_draft';

export type RegisterDraft = {
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

export function readRegisterDraft(): RegisterDraft | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = sessionStorage.getItem(REGISTER_DRAFT_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as RegisterDraft;
  } catch {
    sessionStorage.removeItem(REGISTER_DRAFT_STORAGE_KEY);
    return null;
  }
}

export function writeRegisterDraft(draft: RegisterDraft): void {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.setItem(REGISTER_DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function updateRegisterDraft(
  patch: Partial<RegisterDraft>,
): RegisterDraft {
  const nextDraft = {
    ...(readRegisterDraft() ?? { email: '', password: '' }),
    ...patch,
  };

  writeRegisterDraft(nextDraft);

  return nextDraft;
}

export function clearRegisterDraft(): void {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.removeItem(REGISTER_DRAFT_STORAGE_KEY);
}
