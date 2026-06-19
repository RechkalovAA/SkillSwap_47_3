// src/pages/ProfilePage/ProfilePage.tsx
import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { fetchCities } from '../../api/endpoints/citiesApi';
import {
  fetchSubcategories,
  deleteSkillFromMockDb,
} from '../../api/endpoints/skillsApi';
import {
  getAllUsers,
  updateUserInMockDb,
  updateUserProfileInMockDb,
} from '../../api/endpoints/usersApi';
import { Avatar } from '../../shared/ui/Avatar';
import TagUI from '../../shared/ui/Tag/tagUi';
import { useExchangeRequest } from '../../features/requests/hooks/useExchangeRequest';
import { useFavoriteUsers } from '../../features/favorites/hooks/useFavoriteUsers';
import { CatalogCard } from '../../widgets/CatalogCard';
import { getCategoryVariant } from '../../widgets/CatalogCard/CatalogCard';
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
import { SkillName } from '../../shared/ui/SkillName/SkillName';
import Modal from '../../shared/ui/Modal/Modal';
import type { Subcategory } from '../../entities/skill/model/types';

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
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuth, isLoading, updateUser } = useAuth();
  const {
    favoriteUsers,
    skills,
    isLoading: isFavoritesLoading,
    error: favoritesError,
  } = useFavoriteUsers(isAuth);
  const {
    getIncomingRequestsForUser,
    getOutgoingRequestsForUser,
    getExchangeRequestsForUser,
    updateRequestStatus,
    removeRequest,
    isLoading: isRequestsLoading,
  } = useExchangeRequest();
  const [activeTab, setActiveTab] = useState<ProfileTabKey>(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    return profileTabs.some((item) => item.key === tab)
      ? (tab as ProfileTabKey)
      : 'profile';
  });
  const [cities, setCities] = useState<string[]>([]);

  // Form state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'женский' | 'мужской'>('женский');
  const [city, setCity] = useState('');
  const [about, setAbout] = useState('');
  const [isSaving, setIsSaving] = useState(false);
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
  const [userSkillById, setUserSkillById] = useState<Record<string, string[]>>(
    {},
  );
  const [skillNameById, setSkillNameById] = useState<Record<string, string>>(
    {},
  );
  const [requestFeedback, setRequestFeedback] = useState<FeedbackState | null>(
    null,
  );

  // State for "add skill to learn" modal
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [availableSkillsToLearn, setAvailableSkillsToLearn] = useState<
    Subcategory[]
  >([]);

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

  // Load available skills for the modal when on skills tab
  useEffect(() => {
    const loadAvailableSkills = async () => {
      if (activeTab !== 'skills' || !user) return;
      const subs = await fetchSubcategories();
      const existingIds = new Set(user.skills || []);
      setAvailableSkillsToLearn(subs.filter((s) => !existingIds.has(s.id)));
    };
    loadAvailableSkills();
  }, [activeTab, user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (profileTabs.some((item) => item.key === tab)) {
      setActiveTab(tab as ProfileTabKey);
      return;
    }

    if (location.search) {
      setActiveTab('profile');
    }
  }, [location.search]);

  useEffect(() => {
    const loadRequestDictionaries = async () => {
      const [users, subcategories] = await Promise.all([
        getAllUsers(),
        fetchSubcategories(),
      ]);

      const nextUserNameById: Record<string, string> = {};
      const nextUserSkillById: Record<string, string[]> = {};
      users.forEach((item) => {
        nextUserNameById[item.id] = item.name;
        if (item.skillCanTeach && item.skillCanTeach.length > 0) {
          nextUserSkillById[item.id] = item.skillCanTeach.map(
            (skill) => skill.id,
          );
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

  // Удаление навыка (которым может научить)
  const handleDeleteSkill = async (skillId?: string) => {
    if (!skillId || !user) return;

    if (window.confirm('Вы уверены, что хотите удалить этот навык?')) {
      try {
        await deleteSkillFromMockDb(skillId);

        const updatedSkills =
          user.skillCanTeach?.filter((skill) => skill.id !== skillId) || [];

        await updateUserInMockDb(user.id, { skillCanTeach: updatedSkills });

        const updatedUser = {
          ...user,
          skillCanTeach: updatedSkills,
        };
        updateUser(updatedUser);

        alert('Навык удалён');
      } catch {
        alert('Ошибка при удалении навыка');
      }
    }
  };

  // Удаление навыка из списка "хочет научиться"
  const handleRemoveFromWantsToLearn = async (skillId: string) => {
    if (!user) return;

    const updatedSkills = user.skills?.filter((id) => id !== skillId) || [];

    try {
      await updateUserInMockDb(user.id, { skills: updatedSkills });
      updateUser({ ...user, skills: updatedSkills });
      alert('Навык удалён из списка');

      // Обновляем доступные навыки для модалки
      const subs = await fetchSubcategories();
      const existingIds = new Set(updatedSkills);
      setAvailableSkillsToLearn(subs.filter((s) => !existingIds.has(s.id)));
    } catch {
      alert('Ошибка при удалении навыка');
    }
  };

  // Добавление навыка в "Хочу научиться"
  const handleAddToWantsToLearn = async (skillId: string) => {
    if (!user) return;

    const updatedSkills = [...(user.skills || []), skillId];

    try {
      await updateUserInMockDb(user.id, { skills: updatedSkills });
      updateUser({ ...user, skills: updatedSkills });
      setIsAddSkillModalOpen(false);

      // Обновляем доступные навыки
      const subs = await fetchSubcategories();
      const existingIds = new Set(updatedSkills);
      setAvailableSkillsToLearn(subs.filter((s) => !existingIds.has(s.id)));
    } catch {
      alert('Ошибка при добавлении навыка');
    }
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
    const counterpartySkills = userSkillById[counterpartyId] || [];
    const counterpartySkillId = counterpartySkills[0] || request.skillId;
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
            <div className={styles['skills-header']}>
              <h2 className={styles['skills-title']}>Мои навыки</h2>
              <button
                type="button"
                className={styles['create-skill-button']}
                onClick={() => navigate('/create')}
              >
                + Создать навык
              </button>
            </div>

            <div className={styles['skills-block']}>
              <div className={styles['skills-block-header']}>
                <h3 className={styles['skills-subtitle']}>Может научить</h3>
              </div>
              <div className={styles['skills-list']}>
                {user.skillCanTeach && user.skillCanTeach.length > 0 ? (
                  user.skillCanTeach.map((skill) => (
                    <div key={skill.id} className={styles['skill-item']}>
                      <TagUI variant={getCategoryVariant(skill.categoryId)}>
                        {skill.name}
                      </TagUI>
                      <div className={styles['skills-actions']}>
                        <button
                          type="button"
                          className={styles['skill-edit-btn']}
                          onClick={() => navigate(`/skill/${skill.id}/edit`)}
                          aria-label="Редактировать навык"
                        >
                          <img src={editIcon} alt="Редактировать" />
                        </button>
                        <button
                          type="button"
                          className={styles['skill-delete-btn']}
                          onClick={() => handleDeleteSkill(skill.id)}
                          aria-label="Удалить навык"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M4 7H20"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M10 11V16"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M14 11V16"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M5 7L6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19L19 7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles['skills-empty']}>
                    Вы ещё не добавили навыки, которым можете научить
                  </p>
                )}
              </div>
            </div>

            {/* Блок "Хочет научиться" */}
            <div className={styles['skills-block']}>
              <div className={styles['skills-block-header']}>
                <h3 className={styles['skills-subtitle']}>Хочет научиться</h3>
                <button
                  type="button"
                  className={styles['add-skill-button']}
                  onClick={() => setIsAddSkillModalOpen(true)}
                  aria-label="Добавить навык"
                >
                  + Добавить
                </button>
              </div>
              <div className={styles['skills-list']}>
                {skillsToLearn.length > 0 ? (
                  skillsToLearn.map((skillId) => (
                    <div key={skillId} className={styles['skill-item']}>
                      <TagUI variant="other">
                        <SkillName skillId={skillId} />
                      </TagUI>
                      <button
                        type="button"
                        className={styles['skill-remove-btn']}
                        onClick={() => handleRemoveFromWantsToLearn(skillId)}
                        aria-label="Удалить из списка"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p className={styles['skills-empty']}>
                    Вы ещё не добавили навыки, которым хотите научиться
                  </p>
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
                Пока нет активных или завершенных обменов
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

        if (favoritesError) {
          return (
            <div className={styles['favorites-content']}>
              <h2 className={styles['favorites-title']}>Избранное</h2>
              <p className={styles['favorites-error']}>{favoritesError}</p>
              <Link className={styles['favorites-link']} to="/catalog">
                Перейти в каталог
              </Link>
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
              <Link className={styles['favorites-link']} to="/catalog">
                Перейти в каталог
              </Link>
            </div>
          );
        }

        return (
          <div className={styles['favorites-content']}>
            <h2 className={styles['favorites-title']}>Избранное</h2>
            <p className={styles['favorites-count']}>
              {favoriteUsers.length} предложений
            </p>
            <div className={styles['favorites-grid']}>
              {favoriteUsers.map((favoriteUser) => (
                <CatalogCard
                  key={favoriteUser.id}
                  user={favoriteUser}
                  skills={skills}
                />
              ))}
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
                  onClick={() => {
                    setActiveTab(tab.key);
                    const nextSearch =
                      tab.key === 'profile' ? '' : `?tab=${tab.key}`;
                    navigate({
                      pathname: location.pathname,
                      search: nextSearch,
                    });
                  }}
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

      {/* Модалка добавления навыка */}
      <Modal
        isOpen={isAddSkillModalOpen}
        onClose={() => setIsAddSkillModalOpen(false)}
      >
        <div className={styles['modal-add-skill']}>
          <h3 className={styles['modal-title']}>Добавить навык</h3>
          <div className={styles['skills-to-add-list']}>
            {availableSkillsToLearn.length > 0 ? (
              availableSkillsToLearn.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  className={styles['skill-to-add-item']}
                  onClick={() => handleAddToWantsToLearn(skill.id)}
                >
                  {skill.name}
                </button>
              ))
            ) : (
              <p className={styles['skills-empty-modal']}>
                Все доступные навыки уже добавлены
              </p>
            )}
          </div>
          <button
            type="button"
            className={styles['modal-close-button']}
            onClick={() => setIsAddSkillModalOpen(false)}
          >
            Закрыть
          </button>
        </div>
      </Modal>
    </div>
  );
}
