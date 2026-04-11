import { User } from '../../entities/user/model/types';
import { getAllUsers } from './usersApi';

export const getUserFavorites = async (
  currentUserId: string,
): Promise<User[]> => {
  const users = await getAllUsers();
  const currentUser = users.find((u) => u.id === currentUserId);

  if (!currentUser || !currentUser.favorites?.length) {
    return [];
  }

  const favoriteIds = new Set(currentUser.favorites);

  return users.filter((user) => favoriteIds.has(user.id));
};
