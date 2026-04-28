// src/features/catalog/utils/buildCatalogItems.ts
import type { User } from '../../../entities/user/model/types';
import type { SkillsResponse } from '../../../api/endpoints/skillsApi';
import type { CatalogItem } from '../model/types';
import type { Subcategory } from '../../../entities/skill/model/types';

export function buildCatalogItems(
  users: User[],
  skillsData: SkillsResponse,
): CatalogItem[] {
  const items: CatalogItem[] = [];

  // Построить Map для быстрого поиска субкатегорий (learn) по id
  const subcategoryMap = new Map<string, Subcategory>();
  skillsData.categories.forEach((category) => {
    category.subcategory.forEach((sub) => {
      subcategoryMap.set(sub.id, sub);
    });
  });

  users.forEach((user) => {
    // 1. Создание карточек 'teach' для каждого навыка в массиве
    const teachSkills = user.skillCanTeach || [];
    teachSkills.forEach((skill) => {
      items.push({
        id: `teach-${user.id}-${skill.id}`,
        kind: 'teach',
        categoryId: skill.categoryId ?? '',
        subcategoryId: skill.id ?? '',
        title: skill.name ?? '',
        description: skill.description ?? '',
        authorName: user.name ?? '',
        authorId: user.id,
        avatar: user.avatar,
        images: user.images,
      });
    });

    // 2. Создание карточек 'learn' для каждого навыка, который пользователь хочет изучить
    if (Array.isArray(user.skills)) {
      user.skills.forEach((subid) => {
        const subcategory = subcategoryMap.get(subid);
        if (subcategory) {
          items.push({
            id: `learn-${user.id}-${subid}`,
            kind: 'learn',
            categoryId: subcategory.categoryId,
            subcategoryId: subcategory.id,
            title: subcategory.name ?? '',
            description: '',
            authorName: user.name ?? '',
            authorId: user.id,
            avatar: user.avatar,
          });
        }
      });
    }
  });

  return items;
}
