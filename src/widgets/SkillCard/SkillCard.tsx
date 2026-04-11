// src/widgets/SkillCard/SkillCard.tsx
import { Link } from 'react-router-dom';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/Button';
import TagUI, { TSkillVariant } from '../../shared/ui/Tag/tagUi';
import { SkillTag } from '../../shared/ui/SkillName/SkillTag';
import type { User } from '../../entities/user/model/types';
import styles from './SkillCard.module.css';

interface SkillCardProps {
  user: User;
  variant?: 'default' | 'compact'; // default - полная версия, compact - для похожих
}

function getAgeSuffix(age: number): string {
  if (age % 10 === 1 && age % 100 !== 11) return 'год';
  if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100))
    return 'года';
  return 'лет';
}

export function getCategoryVariant(categoryId: string): TSkillVariant {
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

export function SkillCard({ user, variant = 'default' }: SkillCardProps) {
  const skillsToLearn = user.skills?.slice(0, 3) || [];
  const remainingCount = (user.skills?.length || 0) - 3;

  // Компактная версия для похожих предложений
  if (variant === 'compact') {
    return (
      <div className={styles['skill-card-compact']}>
        <div className={styles['skill-card-header']}>
          <Avatar src={`/avatars/${user.avatar}`} name={user.name} size="lg" />
          <div className={styles['skill-card-info']}>
            <h3 className={styles['skill-card-name']}>{user.name}</h3>
            <p className={styles['skill-card-location']}>
              {user.city}, {user.age} {getAgeSuffix(user.age)}
            </p>
          </div>
        </div>

        {/* Может научить */}
        <div className={styles['skill-card-skills-block']}>
          <h2 className={styles['skill-card-section-title']}>Может научить</h2>
          <div className={styles['skill-card-skills-list']}>
            {user.skillCanTeach && (
              <TagUI
                className={styles['skill-card-skill-text']}
                variant={getCategoryVariant(user.skillCanTeach.categoryId)}
              >
                {user.skillCanTeach.name}
              </TagUI>
            )}
          </div>
        </div>

        {/* Хочет научиться */}
        <div className={styles['skill-card-skills-block']}>
          <h2 className={styles['skill-card-section-title']}>
            Хочет научиться
          </h2>
          <div className={styles['skill-card-skills-list']}>
            {skillsToLearn.map((skillId) => (
              <SkillTag
                className={styles['skill-card-skill-text']}
                key={skillId}
                skillId={skillId}
              />
            ))}
            {remainingCount > 0 && (
              <TagUI key="remaining-count" variant="other">
                +{remainingCount}
              </TagUI>
            )}
          </div>
        </div>

        <Link to={`/skill/${user.skillCanTeach?.id}`}>
          <Button
            variant="primary"
            size="md"
            className={styles['skill-card-button']}
          >
            Смотреть
          </Button>
        </Link>
      </div>
    );
  }

  // Полная версия для главной страницы навыка
  return (
    <div className={styles['skill-card-full']}>
      <div className={styles['skill-card-avatar-wrapper']}>
        <Avatar src={`/avatars/${user.avatar}`} name={user.name} size="lg" />
        <div className={styles['skill-card-text']}>
          <h1 className={styles['skill-card-name-full']}>{user.name}</h1>
          <p className={styles['skill-card-location-full']}>
            {user.city},
            <br />
            {user.age} {getAgeSuffix(user.age)}
          </p>
        </div>
      </div>

      {user.about && <p className={styles['skill-card-bio']}>{user.about}</p>}

      {/* Может научить */}
      <div className={styles['skill-card-skills-block']}>
        <h2 className={styles['skill-card-section-title']}>Может научить</h2>
        <div className={styles['skill-card-skills-list']}>
          {user.skillCanTeach && (
            <TagUI
              className={styles['skill-card-skill-text']}
              variant={getCategoryVariant(user.skillCanTeach.categoryId)}
            >
              {user.skillCanTeach.name}
            </TagUI>
          )}
        </div>
      </div>

      {/* Хочет научиться */}
      <div className={styles['skill-card-skills-block']}>
        <h2 className={styles['skill-card-section-title']}>Хочет научиться</h2>
        <div className={styles['skill-card-skills-list']}>
          {skillsToLearn.map((skillId) => (
            <SkillTag
              className={styles['skill-card-skill-text']}
              key={skillId}
              skillId={skillId}
            />
          ))}
          {remainingCount > 0 && (
            <TagUI key="remaining-count" variant="other">
              +{remainingCount}
            </TagUI>
          )}
        </div>
      </div>
    </div>
  );
}
