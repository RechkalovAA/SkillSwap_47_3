import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSkillPage } from './hooks/useSkillPage';
import { useAuth } from '../../shared/hooks/useAuth';
import { useExchangeRequest } from '../../features/requests/hooks/useExchangeRequest';
import {
  ExchangeModal,
  ExchangeModalType,
} from '../../features/requests/ui/ExchangeModal/ExchangeModal';
import { Button } from '../../shared/ui/Button';
import { SkillCard } from '../../widgets/SkillCard/SkillCard';
import styles from './SkillPage.module.css';

export function SkillPage() {
  // ✅ ВСЕ ХУКИ В НАЧАЛЕ КОМПОНЕНТА
  const { user, relatedUsers, loading, error, skillId } = useSkillPage();
  const { isAuth, user: currentUser } = useAuth();
  const { createRequest, hasActiveRequestForSkill } = useExchangeRequest();
  const navigate = useNavigate();
  const location = useLocation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ExchangeModalType>('auth');

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

  const hasActiveRequest =
    currentUser && skillId && user
      ? hasActiveRequestForSkill(skillId, currentUser.id, user.id)
      : false;

  const handleExchangeClick = () => {
    if (!isAuth || !currentUser) {
      setModalType('auth');
      setModalOpen(true);
      return;
    }

    if (hasActiveRequest) {
      setModalType('request-sent');
      setModalOpen(true);
      return;
    }

    const newRequest = createRequest(currentUser.id, user.id, skillId || '');

    if (newRequest) {
      setModalType('success');
      setModalOpen(true);
    } else {
      setModalType('request-sent');
      setModalOpen(true);
    }
  };

  const handleModalAction = () => {
    if (modalType === 'auth') {
      navigate('/login', {
        state: { from: { pathname: location.pathname } },
      });
    }
    setModalOpen(false);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  // ✅ Основной return
  return (
    <div className={styles['skill-page']}>
      <div className={styles['skill-page-container']}>
        <div className={styles['skill-page-main-grid']}>
          {/* ЛЕВАЯ КОЛОНКА — используем SkillCard с hideButton */}
          <div className={styles['skill-page-left']}>
            <SkillCard user={user} variant="default" hideButton />
          </div>

          {/* ПРАВАЯ КОЛОНКА — описание, фото, кнопка обмена */}
          <div className={styles['skill-page-right']}>
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
                  onClick={handleExchangeClick}
                >
                  Предложить обмен
                </Button>
              </div>
            </div>

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

        {/* Похожие предложения — компактные карточки */}
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

      <ExchangeModal
        isOpen={modalOpen}
        type={modalType}
        onClose={handleModalClose}
        onAction={handleModalAction}
        skillName={user.skillCanTeach?.name}
        userName={user.name}
      />
    </div>
  );
}
