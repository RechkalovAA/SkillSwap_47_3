import type { SkillTeach } from '../../skill/model/types';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  city?: string;
  birthDate: string;
  age: number; // возраст считается на основе даты рождения
  gender: 'женский' | 'мужской';
  createdAt: string; // дата создания профиля
  favorites?: string[]; // массив id пользователей, карточки которых лайкнул данный пользователь
  liked_me?: string[]; // массив id пользователей, которые лайкнули данного пользователя
  skillCanTeach: SkillTeach; // навыки, которым может научить
  images?: string[];
  skills: string[]; // = subcategoriesWantToLearn навыки, которым хочет научиться, массив id субкатегорий
  about?: string; // о себе
}

// В карточке отображается не вся информация из user, то что нужно для карточки можно взять, например, такой тип
// UserCard примерная структура, можно править при необходимости:
export type UserCard = Partial<
  Pick<
    User,
    | 'id'
    | 'name'
    | 'avatar'
    | 'city'
    | 'age'
    | 'gender'
    | 'skillCanTeach'
    | 'images'
    | 'skills'
    | 'about'
  >
>;
