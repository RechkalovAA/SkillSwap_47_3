// src/pages/SkillPage/components/SkillsList.tsx
import type { SkillTeach } from '../../../entities/skill/model/types';
import styles from '../SkillPage.module.css';

interface SkillsListProps {
  canTeach: SkillTeach;
  wantsToLearn: string[];
}

export function SkillsList({ canTeach, wantsToLearn }: SkillsListProps) {
  // Показываем максимум 3 навыка из wantsToLearn
  const displaySkills = wantsToLearn.slice(0, 3);
  const hasMore = wantsToLearn.length > 3;

  return (
    <div className={styles.skillsSection}>
      <div className={styles.skillBlock}>
        <h3 className={styles.skillTitle}>Может научить</h3>
        <div className={styles.skillTags}>
          <span className={styles.skillTag}>{canTeach.name}</span>
        </div>
      </div>

      <div className={styles.skillBlock}>
        <h3 className={styles.skillTitle}>Хочет научиться</h3>
        <div className={styles.skillTags}>
          {displaySkills.map((skillId) => (
            <span key={skillId} className={styles.skillTag}>
              {skillId} {/* TODO: заменить на название навыка из skills.json */}
            </span>
          ))}
          {hasMore && (
            <span className={styles.skillTagMore}>
              +{wantsToLearn.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
