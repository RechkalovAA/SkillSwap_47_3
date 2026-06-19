// src/pages/SkillPage/hooks/useSkillPage.ts
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { User } from '../../../entities/user/model/types';
import {
  getAllUsers,
  getUserById,
  getUsersBySkillId,
} from '../../../api/endpoints/usersApi';

export function useSkillPage() {
  const { skillId, userId } = useParams<{ skillId: string; userId: string }>();
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

        let foundUser: User | null = null;

        // Если есть userId — ищем конкретного пользователя
        if (userId) {
          foundUser = await getUserById(userId);
          // Проверяем, что у пользователя действительно есть этот навык
          // skillCanTeach теперь массив, проверяем наличие навыка с нужным ID
          const hasSkill = foundUser?.skillCanTeach?.some(
            (skill) => skill.id === skillId,
          );
          if (!hasSkill) {
            foundUser = null;
          }
        }

        // Если userId нет или пользователь не найден — ищем по skillId (старая логика)
        if (!foundUser) {
          const users = await getAllUsers();
          foundUser =
            users.find((u) =>
              u.skillCanTeach?.some((skill) => skill.id === skillId),
            ) || null;
        }

        if (!foundUser) {
          setError('Пользователь с таким навыком не найден');
          setUser(null);
          setRelatedUsers([]);
          return;
        }

        setUser(foundUser);

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
  }, [skillId, userId]);

  return { user, relatedUsers, loading, error, skillId };
}
