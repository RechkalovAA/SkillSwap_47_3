// src/shared/ui/SkillName/SkillTag.tsx
import { useSkillName } from '../../../features/skills/hooks/useSkillName';
import { useSkillCategory } from '../../../features/skills/hooks/useSkillCategory';
import TagUI from '../Tag/tagUi';
import type { TSkillVariant } from '../Tag/tagUi';

interface SkillTagProps {
  skillId: string;
  className?: string;
}

function getCategoryVariant(categoryId: string): TSkillVariant {
  const variants: Record<string, TSkillVariant> = {
    '1': 'business',
    '2': 'creative',
    '3': 'languages',
    '4': 'education',
    '5': 'home',
    '6': 'health',
  };
  return variants[categoryId] || 'other';
}

export function SkillTag({ skillId, className }: SkillTagProps) {
  const { skillName, loading: nameLoading } = useSkillName(skillId);
  const { categoryId, loading: categoryLoading } = useSkillCategory(skillId);

  if (nameLoading || categoryLoading) {
    return <span>...</span>;
  }

  return (
    <TagUI variant={getCategoryVariant(categoryId)} className={className}>
      {skillName}
    </TagUI>
  );
}
