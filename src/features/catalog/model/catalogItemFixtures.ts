import { CatalogItem } from './types';

export const catalogItemFixtures: CatalogItem[] = [
  {
    id: 'teach-user_001',
    kind: 'teach',
    categoryId: '6',
    subcategoryId: 'skill_041',
    title: 'Физическая культура',
    description:
      'Провожу силовые тренировки, кардио, функциональный тренинг, растяжка',
    authorName: 'Анна Смирнова',
    authorId: 'user_001',
    avatar: '1.jpg',
    images: ['fk1.jpg', 'fk3.jpg', 'fk5.jpg'],
  },
  {
    id: 'learn-user_001-skill_001',
    kind: 'learn',
    categoryId: '1',
    subcategoryId: 'skill_001',
    title: 'управление командой',
    description: '',
    authorName: 'Анна Смирнова',
    authorId: 'user_001',
    avatar: '1.jpg',
    images: undefined,
  },
  {
    id: 'learn-user_001-skill_017',
    kind: 'learn',
    categoryId: '3',
    subcategoryId: 'skill_017',
    title: 'английский',
    description: '',
    authorName: 'Анна Смирнова',
    authorId: 'user_001',
    avatar: '1.jpg',
    images: undefined,
  },
];
