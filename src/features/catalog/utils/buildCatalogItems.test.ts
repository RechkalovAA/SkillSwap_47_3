// src/features/catalog/utils/buildCatalogItems.test.ts
import { describe, it, expect } from '@jest/globals';
import { buildCatalogItems } from './buildCatalogItems';
import type { User } from '../../../entities/user/model/types';
import type { SkillsResponse } from '../../../api/endpoints/skillsApi';

describe('buildCatalogItems', () => {
  const mockSkillsData: SkillsResponse = {
    categories: [
      {
        id: 'cat-1',
        name: 'Веб Разработка',
        color: '#fff',
        icon: 'W',
        subcategory: [
          { id: 'sub-1', categoryId: 'cat-1', name: 'React' },
          { id: 'sub-2', categoryId: 'cat-1', name: 'Vue' },
        ],
      },
    ],
  };

  const mockUsers: User[] = [
    {
      id: 'usr-1',
      name: 'Alice',
      email: 'alice@test.com',
      password: '123',
      city: 'Moscow',
      birthDate: '2000-01-01',
      age: 20,
      gender: 'женский',
      createdAt: '2023-01-01',
      avatar: 'avatar1.png',
      images: ['img1.png'],
      skillCanTeach: [
        {
          id: 'sub-3',
          categoryId: 'cat-2',
          name: 'Python',
          description: 'Основы Python',
          length: 0,
        },
      ],
      skills: ['sub-1', 'sub-2', 'unknown-subid'],
    },
  ];

  it('должна вернуть плоский список, состоящий из teach и learn карточек', () => {
    const items = buildCatalogItems(mockUsers, mockSkillsData);

    // teach карточек может быть несколько (по числу навыков в skillCanTeach)
    // В данном случае 1 teach + 2 learn = 3
    expect(items.length).toBeGreaterThanOrEqual(3);

    const teachItem = items.find((i) => i.kind === 'teach');
    expect(teachItem).toBeDefined();
    expect(teachItem?.id).toBe('teach-usr-1-sub-3');
    expect(teachItem?.categoryId).toBe('cat-2');
    expect(teachItem?.subcategoryId).toBe('sub-3');
    expect(teachItem?.title).toBe('Python');
    expect(teachItem?.description).toBe('Основы Python');
    expect(teachItem?.authorName).toBe('Alice');
    expect(teachItem?.avatar).toBe('avatar1.png');
    expect(teachItem?.images).toEqual(['img1.png']);

    const learnItems = items.filter((i) => i.kind === 'learn');
    expect(learnItems).toHaveLength(2);
    expect(learnItems[0].id).toBe('learn-usr-1-sub-1');
    expect(learnItems[0].categoryId).toBe('cat-1');
    expect(learnItems[0].subcategoryId).toBe('sub-1');
    expect(learnItems[0].title).toBe('React');
    expect(learnItems[0].description).toBe('');
    expect(learnItems[0].authorName).toBe('Alice');
    expect(learnItems[0].images).toBeUndefined();
  });

  it('должна возвращать пустой массив, если данные пустые', () => {
    expect(buildCatalogItems([], { categories: [] })).toEqual([]);
  });

  it('должна игнорировать карточку teach, если у пользователя нет skillCanTeach (или пустой массив)', () => {
    const userWithoutTeach = {
      ...mockUsers[0],
      skillCanTeach: [],
    } as User;
    const items = buildCatalogItems([userWithoutTeach], mockSkillsData);

    // Ожидаем только карточки learn
    expect(items.find((i) => i.kind === 'teach')).toBeUndefined();
    expect(items.length).toBe(2);
  });

  it('должна обрабатывать пустые массивы навыков (learn) у пользователя', () => {
    const userWithoutLearn = { ...mockUsers[0], skills: [] } as User;
    const items = buildCatalogItems([userWithoutLearn], mockSkillsData);

    // Ожидаем только карточку teach
    expect(items.find((i) => i.kind === 'learn')).toBeUndefined();
    expect(items.length).toBe(1);
  });
});
