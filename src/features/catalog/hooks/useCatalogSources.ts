import { useState, useEffect } from 'react';
import { getAllUsers } from '../../../api/endpoints/usersApi';
import { getAllSkills, SkillsResponse } from '../../../api/endpoints/skillsApi';
import type { User } from '../../../entities/user/model/types';

interface UseCatalogSourcesResult {
  users: User[] | null;
  skills: SkillsResponse | null;
  loading: boolean;
  error: boolean;
}

export function useCatalogSources(): UseCatalogSourcesResult {
  const [users, setUsers] = useState<User[] | null>(null);
  const [skills, setSkills] = useState<SkillsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const [usersData, skillsData] = await Promise.all([
          getAllUsers(),
          getAllSkills(),
        ]);
        setUsers(usersData);
        setSkills(skillsData);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch catalog sources:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { users, skills, loading, error };
}
