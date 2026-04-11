// src/pages/SkillPage/components/SkillDetail.tsx
import { useState } from 'react';
import { Button } from '../../../shared/ui/Button';
import LikeButtonUI from '../../../shared/ui/LikeButton/likeButton';
import type { SkillTeach } from '../../../entities/skill/model/types';
import styles from '../SkillPage.module.css';

interface SkillDetailProps {
  skill: SkillTeach;
  images?: string[];
  // eslint-disable-next-line react/no-unused-prop-types
  userName: string;
}

export function SkillDetail({ skill, images }: SkillDetailProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleExchangeClick = () => {
    // TODO: заменить на модалку с проверкой авторизации
    // eslint-disable-next-line no-alert
    alert('Функция "Предложить обмен" будет доступна после добавления модалки');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className={styles.skillDetail}>
      <div className={styles.skillHeader}>
        <h2 className={styles.skillName}>{skill.name}</h2>
        <LikeButtonUI
          isLiked={isLiked}
          onLikeToggle={handleLike}
          canLike // TODO: проверять авторизацию
        />
      </div>

      {skill.description && (
        <div className={styles.skillDescription}>
          <p>{skill.description}</p>
        </div>
      )}

      {images && images.length > 0 && (
        <div className={styles['skill-page-gallery']}>
          {images.map((image) => (
            <img
              key={image}
              src={`/photos/${image}`}
              alt={`${skill.name}`}
              className={styles['skill-page-gallery-image']}
            />
          ))}
        </div>
      )}

      <div className={styles.exchangeButton}>
        <Button size="lg" variant="primary" onClick={handleExchangeClick}>
          Предложить обмен
        </Button>
      </div>
    </div>
  );
}
