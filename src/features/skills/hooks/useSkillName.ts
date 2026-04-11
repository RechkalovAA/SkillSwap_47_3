import { useEffect, useState } from 'react';
import { fetchSubcategories } from '../../../api/endpoints/skillsApi';

export function useSkillName(skillId: string) {
  const [skillName, setSkillName] = useState<string>(skillId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSkillName = async () => {
      try {
        const subcategories = await fetchSubcategories();
        const skill = subcategories.find((s) => s.id === skillId);
        if (skill) {
          setSkillName(skill.name);
        }
      } catch {
        setSkillName(skillId);
      } finally {
        setLoading(false);
      }
    };

    if (skillId) {
      loadSkillName();
    }
  }, [skillId]);

  return { skillName, loading };
}
