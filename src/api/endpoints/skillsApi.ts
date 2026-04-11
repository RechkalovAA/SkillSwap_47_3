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
