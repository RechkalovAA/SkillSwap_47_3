import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { User } from '../../../entities/user/model/types';
import {
  getUserBySkillId,
  getUsersBySkillId,
} from '../../../api/endpoints/usersApi';

export function useSkillPage() {
  const { id: skillId } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [relatedUsers, setRelatedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!skillId) {
      setError('Навык не найден');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const foundUser = await getUserBySkillId(skillId);

        if (!foundUser) {
          setError('Пользователь с таким навыком не найден');
          setUser(null);
          setRelatedUsers([]);
          return;
        }

        setUser(foundUser);

        // skillId, максимум 4.
        // Загружаем похожие предложения (другие пользователи с таким же навыком)
        const related = await getUsersBySkillId(skillId, foundUser.id);
        setRelatedUsers(related.slice(0, 4));
      } catch {
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [skillId]);

  return { user, relatedUsers, loading, error, skillId };
}
