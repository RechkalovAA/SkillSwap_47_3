export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategory: Subcategory[];
};

export type Subcategory = {
  id: string;
  categoryId: string;
  name: string;
};

export type SkillTeach = {
  length: number;
  id: string; // id субкатегории / навыка
  categoryId: string;
  name: string;
  description?: string;
};
