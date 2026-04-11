import { useEffect, useState } from 'react';
import { fetchSubcategories } from '../../../api/endpoints/skillsApi';

export function useSkillCategory(skillId: string) {
  const [categoryId, setCategoryId] = useState<string>('other');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const subcategories = await fetchSubcategories();
        const skill = subcategories.find((s) => s.id === skillId);

        if (skill?.categoryId) {
          setCategoryId(skill.categoryId);
        } else {
          const skillCategoryMap: Record<string, string> = {
            skill_001: '1',
            skill_002: '1',
            skill_009: '2',
            skill_010: '2',
            skill_011: '2',
            skill_012: '2',
            skill_017: '3',
            skill_018: '3',
            skill_019: '3',
          };

          if (skillCategoryMap[skillId]) {
            setCategoryId(skillCategoryMap[skillId]);
          }
        }
      } catch {
        setCategoryId('other');
      } finally {
        setLoading(false);
      }
    };

    if (skillId) {
      loadCategory();
    } else {
      setCategoryId('other');
      setLoading(false);
    }
  }, [skillId]);

  return { categoryId, loading };
}
