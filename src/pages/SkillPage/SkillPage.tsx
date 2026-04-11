import { useSkillPage } from './hooks/useSkillPage';
import { Button } from '../../shared/ui/Button';
import { SkillCard } from '../../widgets/SkillCard/SkillCard';
import styles from './SkillPage.module.css';

export function SkillPage() {
  const { user, relatedUsers, loading, error } = useSkillPage();

  if (loading) {
    return (
      <div className={styles['skill-page']}>
        <div className={styles['skill-page-container']}>
          <div className={styles['skill-page-loading']}>Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles['skill-page']}>
        <div className={styles['skill-page-container']}>
          <div className={styles['skill-page-error']}>
            {error || 'Навык не найден'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['skill-page']}>
      <div className={styles['skill-page-container']}>
        {/* ОСНОВНАЯ СЕТКА (2 колонки) */}
        <div className={styles['skill-page-main-grid']}>
          {/* ЛЕВАЯ КОЛОНКА (320px) — используем SkillCard в полной версии */}
          <div className={styles['skill-page-left']}>
            <SkillCard user={user} variant="default" />
          </div>

          {/* ПРАВАЯ КОЛОНКА (внутренний грид 3 колонки) */}
          <div className={styles['skill-page-right']}>
            {/* Колонка 2A — Описание */}
            <div className={styles['skill-page-description-block']}>
              <div className={styles['skill-page-skill-text']}>
                <h2 className={styles['skill-page-skill-name']}>
                  {user.skillCanTeach?.name}
                </h2>
                <span className={styles['skill-page-skill-category']}>
                  Творчество и искусство / Музыка и звук
                </span>
                <p className={styles['skill-page-skill-description']}>
                  {user.skillCanTeach?.description || 'Описание отсутствует'}
                </p>
              </div>
              <div className={styles['skill-page-exchange-button']}>
                <Button
                  variant="primary"
                  size="lg"
                  className={styles['skill-page-exchange-full-width']}
                >
                  Предложить обмен
                </Button>
              </div>
            </div>

            {/* Колонка 2B — Главное фото */}
            <div className={styles['skill-page-main-photo']}>
              <img
                src={
                  user.images?.[0]
                    ? `/photos/${user.images[0]}`
                    : '/placeholder.jpg'
                }
                alt={user.skillCanTeach?.name}
                className={styles['skill-page-main-photo-image']}
              />
            </div>

            {/* Колонка 2C — Вертикальная карусель */}
            {user.images && user.images.length > 1 && (
              <div className={styles['skill-page-vertical-carousel']}>
                <div className={styles['skill-page-carousel-container']}>
                  {user.images.slice(1).map((image, idx) => (
                    <img
                      key={image}
                      src={`/photos/${image}`}
                      alt={`${user.skillCanTeach?.name} - фото ${idx + 2}`}
                      className={styles['skill-page-carousel-item']}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Похожие предложения — используем SkillCard в компактной версии */}
        {relatedUsers.length > 0 && (
          <div className={styles['skill-page-related-section']}>
            <h2 className={styles['skill-page-section-title']}>
              Похожие предложения
            </h2>
            <div className={styles['skill-page-related-grid']}>
              {relatedUsers.map((relatedUser) => (
                <SkillCard
                  key={relatedUser.id}
                  user={relatedUser}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
