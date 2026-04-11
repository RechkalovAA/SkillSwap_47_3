import { User } from '../../entities/user/model/types';
import { loadJson } from './loadJson';

type UsersResponse = {
  users: User[];
};

export const fetchCities = async (): Promise<string[]> => {
  const data = await loadJson<UsersResponse>('/db/users.json');
  const { users } = data;

  const uniqueCities = new Set<string>();
  users.forEach((user) => {
    if (user.city) {
      uniqueCities.add(user.city);
    }
  });

  return Array.from(uniqueCities).sort();
};
