// src/shared/ui/SkillName/SkillName.tsx
import { useSkillName } from '../../../features/skills/hooks/useSkillName';

interface SkillNameProps {
  skillId: string;
}

export function SkillName({ skillId }: SkillNameProps) {
  const { skillName, loading } = useSkillName(skillId);

  if (loading) {
    return <span>...</span>;
  }

  return <span>{skillName}</span>;
}
