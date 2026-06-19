// src/widgets/CatalogCard/CatalogCard.tsx
import { type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/Button';
import styles from './CatalogCard.module.css';
import TagUI, { type TSkillVariant } from '../../shared/ui/Tag/tagUi';
import { SkillName } from '../../shared/ui/SkillName/SkillName';
import like from '../../assets/images/like.svg';
import like_active from '../../assets/images/like_active.svg';
import type { User } from '../../entities/user/model/types';
import type { SkillsResponse } from '../../api/endpoints/skillsApi';
import { useAuth } from '../../shared/hooks/useAuth';
import { useFavorites } from '../../features/favorites/hooks/useFavorites';

// Тип варианта карточки
export type CatalogCardVariant = 'default' | 'compact';

interface CatalogCardProps {
  user: User;
  skills?: SkillsResponse | null;
  variant?: CatalogCardVariant;
  hideButton?: boolean;
  activeSkillId?: string;
}

function getAgeSuffix(age: number): string {
  if (age % 10 === 1 && age % 100 !== 11) return 'год';
  if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100))
    return 'года';
  return 'лет';
}

// Функция для определения варианта тега по категории с правильным типом
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

const VISIBLE_LEARN = 2;

export function CatalogCard({
  user,
  skills,
  variant = 'default',
  hideButton = false,
  activeSkillId,
}: CatalogCardProps) {
  const { isAuth } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const catalogItemId = `teach-${user.id}`;
  const liked = isFavorite(catalogItemId);

  // Получаем навык для отображения
  const displayTeachSkill = activeSkillId
    ? user.skillCanTeach?.find((skill) => skill.id === activeSkillId)
    : user.skillCanTeach?.[0];

  const learnIds = user.skills ?? [];
  const visibleLearn = learnIds.slice(0, VISIBLE_LEARN);
  const learnExtra = learnIds.length - VISIBLE_LEARN;
  const isCompact = variant === 'compact';

  return (
    <div className={styles.card}>
      {/* Лайк - только для обычного варианта */}
      {!hideButton && (
        <div
          className={`${styles.likes} ${!isAuth ? styles['likes-guest'] : ''}`}
          {...(isAuth
            ? {
                role: 'button' as const,
                tabIndex: 0,
                onClick: () => toggleFavorite(catalogItemId),
                onKeyDown: (e: KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFavorite(catalogItemId);
                  }
                },
                'aria-label': liked
                  ? 'Убрать из избранного'
                  : 'Добавить в избранное',
              }
            : {
                'aria-label':
                  'Избранное недоступно: войдите в аккаунт, чтобы добавлять карточки',
                title: 'Войдите в аккаунт, чтобы добавить в избранное',
              })}
        >
          <img src={liked ? like_active : like} alt="" aria-hidden="true" />
        </div>
      )}

      <div className={styles.header}>
        <Avatar
          src={user.avatar ? `/avatars/${user.avatar}` : undefined}
          name={user.name}
          size={isCompact ? 'md' : 'lg'}
        />
        <div className={styles['author-info']}>
          <div className={styles['author-name']}>{user.name.split(' ')[0]}</div>
          <div className={styles['skill-page-location']}>
            <span>{user.city}, </span>
            <span>
              {user.age} {getAgeSuffix(user.age)}
            </span>
          </div>
        </div>
      </div>

      {/* Блок "Может научить" */}
      <div className={styles['skills-block']}>
        <h3 className={styles['section-title']}>Может научить:</h3>
        <div className={styles['tag-row']}>
          {displayTeachSkill ? (
            <TagUI
              className={styles.tag}
              variant={getCategoryVariant(displayTeachSkill.categoryId)}
            >
              {displayTeachSkill.name}
            </TagUI>
          ) : (
            <TagUI className={styles.tag} variant="other">
              Не указано
            </TagUI>
          )}
        </div>
      </div>

      {/* Блок "Хочет научиться" - показываем только для обычного варианта */}
      {!isCompact && (
        <div className={styles['skills-block']}>
          <h3 className={styles['section-title']}>Хочет научиться:</h3>
          <div className={styles['tag-row']}>
            {skills && learnIds.length > 0 ? (
              <>
                {visibleLearn.map((skillId) => (
                  <TagUI key={skillId} className={styles.tag} variant="other">
                    <SkillName skillId={skillId} />
                  </TagUI>
                ))}
                {learnExtra > 0 ? (
                  <TagUI className={styles.tag} variant="other">
                    +{learnExtra}
                  </TagUI>
                ) : null}
              </>
            ) : (
              <TagUI className={styles.tag} variant="other">
                Не указано
              </TagUI>
            )}
          </div>
        </div>
      )}

      {/* Кнопка "Подробнее" / "Смотреть" */}
      {!hideButton && displayTeachSkill?.id && (
        <div className={styles.footer}>
          <Link
            to={`/skill/${displayTeachSkill.id}/${user.id}`}
            className={styles.link}
          >
            <Button variant="primary" size="md" className={styles.button}>
              {isCompact ? 'Смотреть' : 'Подробнее'}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
