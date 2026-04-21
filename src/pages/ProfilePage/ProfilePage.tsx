// src/pages/ProfilePage/ProfilePage.tsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { fetchCities } from '../../api/endpoints/citiesApi';
import { fetchSubcategories } from '../../api/endpoints/skillsApi';
import {
  getAllUsers,
  updateUserProfileInMockDb,
} from '../../api/endpoints/usersApi';
import { Avatar } from '../../shared/ui/Avatar';
import TagUI from '../../shared/ui/Tag/tagUi';
import { getCategoryVariant } from '../../widgets/SkillCard/SkillCard';
import { useExchangeRequest } from '../../features/requests/hooks/useExchangeRequest';
import type { User } from '../../entities/user/model/types';
import type {
  ExchangeRequest,
  RequestStatus,
} from '../../features/requests/model/types';
import requestIcon from '../../assets/images/request.svg';
import messageIcon from '../../assets/images/message-text.svg';
import favoriteIcon from '../../assets/images/like.svg';
import skillsIcon from '../../assets/images/idea.svg';
import userIcon from '../../assets/images/user.svg';
import editIcon from '../../assets/images/edit.png';
import calendarIcon from '../../assets/images/calendar.svg';
import chevronDownIcon from '../../assets/images/chevron-down.svg';
import styles from './ProfilePage.module.css';

const profileTabs = [
  { key: 'requests', label: 'Заявки', icon: requestIcon },
  { key: 'exchanges', label: 'Мои обмены', icon: messageIcon },
  { key: 'favorites', label: 'Избранное', icon: favoriteIcon },
  { key: 'skills', label: 'Мои навыки', icon: skillsIcon },
  { key: 'profile', label: 'Личные данные', icon: userIcon },
] as const;

type ProfileTabKey = (typeof profileTabs)[number]['key'];

const GENDER_OPTIONS = [
  { value: 'женский', label: 'Женский' },
  { value: 'мужской', label: 'Мужской' },
] as const;

const requestStatusMap: Record<string, string> = {
  pending: 'Ожидает',
  accepted: 'Принята',
  rejected: 'Отклонена',
  inProgress: 'В процессе',
  done: 'Завершена',
};

const requestStatusClassSuffix: Record<RequestStatus, string> = {
  pending: 'pending',
  accepted: 'accepted',
  rejected: 'rejected',
  inProgress: 'in-progress',
  done: 'done',
};

type FeedbackState = {
  type: 'success' | 'error';
  text: string;
};

export default function ProfilePage() {
  const { user, isAuth, isLoading, updateUser } = useAuth();
  const {
    getIncomingRequestsForUser,
    getOutgoingRequestsForUser,
    getExchangeRequestsForUser,
    updateRequestStatus,
    removeRequest,
    isLoading: isRequestsLoading,
  } = useExchangeRequest();
  const [activeTab, setActiveTab] = useState<ProfileTabKey>('profile');
  const [cities, setCities] = useState<string[]>([]);

  // Form state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'женский' | 'мужской'>('женский');
  const [city, setCity] = useState('');
  const [about, setAbout] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [favoriteUsers] = useState<User[]>([]); // ← исправлено: User[] вместо any[]
  const [isFavoritesLoading] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState<ExchangeRequest[]>(
    [],
  );
  const [outgoingRequests, setOutgoingRequests] = useState<ExchangeRequest[]>(
    [],
  );
  const [exchangeRequests, setExchangeRequests] = useState<ExchangeRequest[]>(
    [],
  );
  const [userNameById, setUserNameById] = useState<Record<string, string>>({});
  const [userSkillById, setUserSkillById] = useState<Record<string, string>>(
    {},
  );
  const [skillNameById, setSkillNameById] = useState<Record<string, string>>(
    {},
  );
  const [requestFeedback, setRequestFeedback] = useState<FeedbackState | null>(
    null,
  );
  const skillsToLearn = user?.skills?.slice(0, 10) || [];

  useEffect(() => {
    const loadCities = async () => {
      const citiesList = await fetchCities();
      setCities(citiesList);
    };
    loadCities();
  }, []);

  useEffect(() => {
    if (user) {
      setEmail(user.email ?? '');
      setName(user.name ?? '');
      setBirthDate(user.birthDate ?? '');
      setGender(user.gender ?? 'женский');
      setCity(user.city ?? '');
      setAbout(user.about ?? '');
    }
  }, [user]);

  useEffect(() => {
    const loadRequestDictionaries = async () => {
      const [users, subcategories] = await Promise.all([
        getAllUsers(),
        fetchSubcategories(),
      ]);

      const nextUserNameById: Record<string, string> = {};
      const nextUserSkillById: Record<string, string> = {};
      users.forEach((item) => {
        nextUserNameById[item.id] = item.name;
        if (item.skillCanTeach?.id) {
          nextUserSkillById[item.id] = item.skillCanTeach.id;
        }
      });

      const nextSkillNameById: Record<string, string> = {};
      subcategories.forEach((skill) => {
        nextSkillNameById[skill.id] = skill.name;
      });

      setUserNameById(nextUserNameById);
      setUserSkillById(nextUserSkillById);
      setSkillNameById(nextSkillNameById);
    };

    loadRequestDictionaries();
  }, []);

  const refreshRequests = useCallback(() => {
    if (!user) {
      setIncomingRequests([]);
      setOutgoingRequests([]);
      setExchangeRequests([]);
      return;
    }

    setIncomingRequests(getIncomingRequestsForUser(user.id));
    setOutgoingRequests(getOutgoingRequestsForUser(user.id));
    setExchangeRequests(getExchangeRequestsForUser(user.id));
  }, [
    getExchangeRequestsForUser,
    getIncomingRequestsForUser,
    getOutgoingRequestsForUser,
    user,
  ]);

  useEffect(() => {
    refreshRequests();
  }, [refreshRequests]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'exchange_requests') {
        refreshRequests();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [refreshRequests]);

  if (isLoading) {
    return <div className={styles['profile-state']}>Загрузка профиля...</div>;
  }

  if (!isAuth || !user) {
    return (
      <div className={styles['profile-state']}>
        Пожалуйста, войдите в аккаунт
      </div>
    );
  }

  const hasChanges = () => {
    if (!user) return false;
    return (
      email !== (user.email ?? '') ||
      name !== (user.name ?? '') ||
      birthDate !== (user.birthDate ?? '') ||
      gender !== (user.gender ?? 'женский') ||
      city !== (user.city ?? '') ||
      about !== (user.about ?? '')
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges() || isSaving) return;

    setIsSaving(true);
    const nextUser = {
      ...user,
      email: email.trim(),
      name: name.trim(),
      birthDate: birthDate.trim(),
      gender,
      city: city.trim() || undefined,
      about: about.trim() || undefined,
    };

    updateUser(nextUser);
    await updateUserProfileInMockDb(user.id, {
      email: nextUser.email,
      name: nextUser.name,
      birthDate: nextUser.birthDate,
      gender: nextUser.gender,
      city: nextUser.city,
      about: nextUser.about,
    });
    setIsSaving(false);
  };

  const handleRequestAction = (
    requestId: string,
    nextStatus: RequestStatus,
  ) => {
    if (!user) return;

    const updated = updateRequestStatus(requestId, user.id, nextStatus);
    if (!updated) {
      setRequestFeedback({
        type: 'error',
        text: 'Не удалось обновить статус заявки',
      });
      return;
    }

    setRequestFeedback(null);
    refreshRequests();
  };

  const handlePendingOutgoingCancel = (requestId: string) => {
    if (!user) return;

    const removed = removeRequest(requestId, user.id);
    if (!removed) {
      setRequestFeedback({
        type: 'error',
        text: 'Не удалось отменить заявку',
      });
      return;
    }

    setRequestFeedback(null);
    refreshRequests();
  };

  const renderRequestCard = (
    request: ExchangeRequest,
    currentUserId: string,
  ) => {
    const isIncoming = request.toUserId === currentUserId;
    const isOutgoing = request.fromUserId === currentUserId;
    const counterpartyId = isIncoming ? request.fromUserId : request.toUserId;
    const counterpartyName = userNameById[counterpartyId] || counterpartyId;
    const skillName = skillNameById[request.skillId] || request.skillId;
    const counterpartySkillId =
      userSkillById[counterpartyId] || request.skillId;
    const counterpartyLink = `/skill/${counterpartySkillId}/${counterpartyId}`;
    const isPendingOutgoing = isOutgoing && request.status === 'pending';

    return (
      <article
        key={request.id}
        className={`${styles['request-card']} ${
          isOutgoing ? styles['request-card-outgoing'] : ''
        }`}
      >
        <Link to={counterpartyLink} className={styles['request-link']}>
          <div className={styles['request-header']}>
            <span className={styles['request-skill']}>Навык: {skillName}</span>
            {isPendingOutgoing ? (
              <button
                type="button"
                className={`${styles['request-status']} ${
                  styles[
                    `request-status-${requestStatusClassSuffix[request.status]}`
                  ]
                } ${styles['request-status-cancel-button']}`}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handlePendingOutgoingCancel(request.id);
                }}
                disabled={isRequestsLoading}
              >
                <span className={styles['request-status-default-text']}>
                  {requestStatusMap[request.status] || request.status}
                </span>
                <span className={styles['request-status-hover-text']}>
                  Отменить
                </span>
              </button>
            ) : (
              <span
                className={`${styles['request-status']} ${
                  styles[
                    `request-status-${requestStatusClassSuffix[request.status]}`
                  ]
                }`}
              >
                {requestStatusMap[request.status] || request.status}
              </span>
            )}
          </div>

          <p className={styles['request-info']}>
            {isIncoming && `От пользователя ${counterpartyName}`}
            {isOutgoing && `Заявка пользователю ${counterpartyName}`}
          </p>

          <div className={styles['request-date']}>
            Создана: {new Date(request.createdAt).toLocaleDateString('ru-RU')}
          </div>
        </Link>

        {request.status === 'pending' && isIncoming && (
          <div className={styles['request-actions']}>
            <button
              type="button"
              className={styles['request-action-accept']}
              onClick={(event) => {
                event.stopPropagation();
                handleRequestAction(request.id, 'accepted');
              }}
              disabled={isRequestsLoading}
            >
              Принять
            </button>
            <button
              type="button"
              className={styles['request-action-reject']}
              onClick={(event) => {
                event.stopPropagation();
                handleRequestAction(request.id, 'rejected');
              }}
              disabled={isRequestsLoading}
            >
              Отклонить
            </button>
          </div>
        )}

        {request.status === 'accepted' && (
          <div className={styles['request-actions']}>
            <button
              type="button"
              className={styles['request-action-progress']}
              onClick={(event) => {
                event.stopPropagation();
                handleRequestAction(request.id, 'inProgress');
              }}
              disabled={isRequestsLoading}
            >
              Перевести в работу
            </button>
          </div>
        )}

        {request.status === 'inProgress' && (
          <div className={styles['request-actions']}>
            <button
              type="button"
              className={styles['request-action-done']}
              onClick={(event) => {
                event.stopPropagation();
                handleRequestAction(request.id, 'done');
              }}
              disabled={isRequestsLoading}
            >
              Завершить обмен
            </button>
          </div>
        )}
      </article>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form className={styles['profile-form']} onSubmit={handleSave}>
            <div className={styles.field}>
              <span className={styles.label}>Почта</span>
              <span className={styles['input-wrap']}>
                <input
                  type="email"
                  className={`${styles['input-control']} ${styles['input-with-icon']}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Не указано"
                />
                <img
                  className={styles['field-icon-edit']}
                  src={editIcon}
                  alt=""
                />
              </span>
            </div>

            <button type="button" className={styles['password-link']}>
              Изменить пароль
            </button>

            <div className={styles.field}>
              <span className={styles.label}>Имя</span>
              <span className={styles['input-wrap']}>
                <input
                  type="text"
                  className={`${styles['input-control']} ${styles['input-with-icon']}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Не указано"
                />
                <img
                  className={styles['field-icon-edit']}
                  src={editIcon}
                  alt=""
                />
              </span>
            </div>

            <div className={styles['field-row']}>
              <div className={styles.field}>
                <span className={styles.label}>Дата рождения</span>
                <span className={styles['input-wrap']}>
                  <input
                    type="text"
                    className={`${styles['input-control']} ${styles['input-with-icon']}`}
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    placeholder="ДД.ММ.ГГГГ"
                  />
                  <img
                    className={styles['field-icon-calendar']}
                    src={calendarIcon}
                    alt=""
                  />
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Пол</span>
                <span className={styles['select-wrap']}>
                  <select
                    className={styles['select-control']}
                    value={gender}
                    onChange={(e) =>
                      setGender(e.target.value as 'женский' | 'мужской')
                    }
                  >
                    {GENDER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <img
                    className={styles['field-arrow']}
                    src={chevronDownIcon}
                    alt=""
                  />
                </span>
              </div>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Город</span>
              <span className={styles['select-wrap']}>
                <select
                  className={styles['select-control']}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">Не указано</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <img
                  className={styles['field-arrow']}
                  src={chevronDownIcon}
                  alt=""
                />
              </span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>О себе</span>
              <span className={styles['input-wrap']}>
                <textarea
                  className={`${styles['textarea-control']} ${styles['input-with-icon']}`}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Не указано"
                  rows={4}
                />
                <img
                  className={styles['field-icon-edit']}
                  src={editIcon}
                  alt=""
                />
              </span>
              <div className={styles['char-counter']}>{about.length}/500</div>
            </div>

            <button
              type="submit"
              className={styles['save-button']}
              disabled={!hasChanges() || isSaving}
            >
              Сохранить
            </button>
          </form>
        );

      case 'skills':
        return (
          <div className={styles['skills-section']}>
            <div className={styles['skills-block']}>
              <h2 className={styles['skills-title']}>Может научить</h2>
              <div className={styles['skills-list']}>
                {user.skillCanTeach ? (
                  <TagUI
                    variant={getCategoryVariant(user.skillCanTeach.categoryId)}
                  >
                    {user.skillCanTeach.name}
                  </TagUI>
                ) : (
                  <p className={styles['skills-empty']}>Не указано</p>
                )}
              </div>
            </div>

            <div className={styles['skills-block']}>
              <h2 className={styles['skills-title']}>Хочет научиться</h2>
              <div className={styles['skills-list']}>
                {skillsToLearn.length > 0 ? (
                  skillsToLearn.map((skillId) => (
                    <TagUI key={skillId} variant="other">
                      {skillId}
                    </TagUI>
                  ))
                ) : (
                  <p className={styles['skills-empty']}>Не указано</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'requests':
        return (
          <div className={styles['requests-section']}>
            <h2 className={styles['section-title']}>Входящие</h2>
            {incomingRequests.length === 0 ? (
              <p className={styles['requests-empty']}>
                Входящих заявок пока нет
              </p>
            ) : (
              <div className={styles['requests-list']}>
                {incomingRequests.map((request) =>
                  renderRequestCard(request, user.id),
                )}
              </div>
            )}

            <h2 className={styles['section-title']}>Исходящие</h2>
            {outgoingRequests.length === 0 ? (
              <p className={styles['requests-empty']}>
                Вы еще не отправляли заявки
              </p>
            ) : (
              <div className={styles['requests-list']}>
                {outgoingRequests.map((request) =>
                  renderRequestCard(request, user.id),
                )}
              </div>
            )}
          </div>
        );

      case 'exchanges':
        return (
          <div className={styles['requests-section']}>
            <h2 className={styles['section-title']}>Мои обмены</h2>
            {exchangeRequests.length === 0 ? (
              <p className={styles['requests-empty']}>
                Пока нет активных или завершенных обменовФ
              </p>
            ) : (
              <div className={styles['requests-list']}>
                {exchangeRequests.map((request) =>
                  renderRequestCard(request, user.id),
                )}
              </div>
            )}
          </div>
        );

      case 'favorites': {
        if (isFavoritesLoading) {
          return (
            <div className={styles['favorites-content']}>
              <h2 className={styles['favorites-title']}>Избранное</h2>
              <p className={styles.loading}>Загрузка избранного...</p>
            </div>
          );
        }

        if (favoriteUsers.length === 0) {
          return (
            <div className={styles['favorites-content']}>
              <h2 className={styles['favorites-title']}>Избранное</h2>
              <p className={styles['favorites-empty']}>
                Вы еще не добавили карточки в избранное.
              </p>
            </div>
          );
        }

        return (
          <div className={styles['favorites-content']}>
            <h2 className={styles['favorites-title']}>Избранное</h2>
            <div className={styles['favorites-grid']}>
              {/* Здесь будут карточки избранных пользователей */}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className={styles['profile-page']}>
      <aside className={styles['sidebar-shell']} aria-label="Навигация профиля">
        <div className={styles.sidebar}>
          <ul className={styles['sidebar-list']}>
            {profileTabs.map((tab) => (
              <li key={tab.label}>
                <button
                  type="button"
                  className={`${styles['sidebar-item']} ${activeTab === tab.key ? styles['sidebar-item-active'] : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <img
                    className={styles['sidebar-item-icon']}
                    src={tab.icon}
                    alt=""
                  />
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className={styles.content}>
        {requestFeedback && (
          <div
            className={`${styles['request-feedback']} ${
              requestFeedback.type === 'success'
                ? styles['request-feedback-success']
                : styles['request-feedback-error']
            }`}
          >
            {requestFeedback.text}
          </div>
        )}
        {renderContent()}

        <div>
          <Avatar src={`/avatars/${user.avatar}`} name={user.name} size="lg" />
        </div>
      </div>
    </div>
  );
}
