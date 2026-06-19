import { Category, Subcategory } from '../../entities/skill/model/types';
import { loadJson } from './loadJson';

export type SkillsResponse = {
  categories: Category[];
};

type PlainCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

// получение всего skills.json, все категории и их субкатегории
export const getAllSkills = async (): Promise<SkillsResponse> =>
  loadJson<SkillsResponse>('/db/skills.json');
// получение списка категорий без субкатегорий, (для выпадающего списка)
export const fetchCategories = async (): Promise<PlainCategory[]> => {
  const data = await loadJson<SkillsResponse>('/db/skills.json');
  return data.categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    color: cat.color,
  }));
};
// получение списка субкатегорий
export const fetchSubcategories = async (): Promise<Subcategory[]> => {
  const data = await loadJson<SkillsResponse>('/db/skills.json');
  const subcategories: Subcategory[] = [];
  data.categories.forEach((cat) => {
    subcategories.push(...cat.subcategory);
  });
  return subcategories;
};

export const MOCK_SKILLS_STORAGE_KEY = 'mock_skills_db';

export interface MockSkill {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  tags?: string[];
  image?: string;
  createdAt: string;
  userId: string;
}

export function readMockSkillsDb(): MockSkill[] {
  if (typeof window === 'undefined') return [];

  const raw = localStorage.getItem(MOCK_SKILLS_STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as MockSkill[];
  } catch {
    localStorage.removeItem(MOCK_SKILLS_STORAGE_KEY);
    return [];
  }
}

function writeMockSkillsDb(skills: MockSkill[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOCK_SKILLS_STORAGE_KEY, JSON.stringify(skills));
}

export async function saveSkillToMockDb(skill: MockSkill): Promise<boolean> {
  const skills = readMockSkillsDb();
  skills.push(skill);
  writeMockSkillsDb(skills);
  return true;
}

export async function getUserMockSkills(userId: string): Promise<MockSkill[]> {
  const skills = readMockSkillsDb();
  return skills.filter((skill) => skill.userId === userId);
}

// Функция удаления навыка

export async function deleteSkillFromMockDb(skillId: string): Promise<boolean> {
  try {
    const skills = readMockSkillsDb();
    const filteredSkills = skills.filter((skill) => skill.id !== skillId);
    writeMockSkillsDb(filteredSkills);
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting skill:', error);
    return false;
  }
}
