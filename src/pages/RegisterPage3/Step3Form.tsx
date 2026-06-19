// src/pages/RegisterPage3/Step3Form.tsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LoginHeader } from '../LoginPage/LoginHeader';
import styles from './Step3Form.module.css';
import schoolBoardImage from './school-board.png';
import {
  fetchCategories,
  fetchSubcategories,
} from '../../api/endpoints/skillsApi';
import type { Subcategory, SkillTeach } from '../../entities/skill/model/types';
import { registerMockUser } from '../../features/auth/api/registerMockUser';
import {
  clearRegisterDraft,
  readRegisterDraft,
  updateRegisterDraft,
} from '../../features/auth/lib/registerDraft';
import { useAuth } from '../../shared/hooks/useAuth';
import { resolvePostAuthRedirect } from '../../app/types/routes';
import {
  validateSkillForm,
  isFormValid,
  type ValidationErrors,
} from '../../features/validation/skillFormValidation';
import { updateUserInMockDb, getUserById } from '../../api/endpoints/usersApi';

const MAX_TITLE_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 500;

interface Step3FormProps {
  isEditMode?: boolean;
  editSkillId?: string;
}

function Step3Form({ isEditMode = false, editSkillId }: Step3FormProps) {
  const { login, user: currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ skillId?: string }>();

  // Определяем режим: редактирование или создание
  const isEditing = isEditMode || !!params.skillId;
  const skillIdToEdit = editSkillId || params.skillId;

  const [draft] = useState(() => readRegisterDraft());

  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; icon: string }>
  >([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Загрузка существующего навыка при редактировании
  useEffect(() => {
    const loadSkillForEdit = async () => {
      if (!isEditing || !skillIdToEdit || !currentUser) return;

      // Ищем навык в массиве skillCanTeach
      const skill = currentUser.skillCanTeach?.find(
        (s) => s.id === skillIdToEdit,
      );
      if (skill) {
        setSkillName(skill.name);
        setDescription(skill.description || '');
        setCategory(skill.categoryId);
        setSubcategory(skill.id);

        // Загружаем изображение из пользователя, если есть
        const skillImage = currentUser.images?.find((img) =>
          img.includes(skillIdToEdit),
        );
        if (skillImage) setImageUrl(skillImage);
      }
    };

    loadSkillForEdit();
  }, [isEditing, skillIdToEdit, currentUser]);

  // Для нового пользователя — из черновика
  useEffect(() => {
    if (!isEditing && draft?.email && !draft?.password) {
      navigate('/register', { replace: true, state: location.state });
      return;
    }

    if (!isEditing) {
      setDescription(draft?.about ?? '');
      // Черновик может содержать skillCanTeach как массив
      const draftSkill = draft?.skillCanTeach?.[0];
      setSkillName(draftSkill?.name ?? '');
      setCategory(draftSkill?.categoryId ?? '');
      setSubcategory(draftSkill?.id ?? '');
    }
  }, [draft, navigate, location.state, isEditing]);

  useEffect(() => {
    const loadOptions = async () => {
      const [nextCategories, nextSubcategories] = await Promise.all([
        fetchCategories(),
        fetchSubcategories(),
      ]);

      setCategories(nextCategories);
      setSubcategories(nextSubcategories);
    };

    loadOptions().catch(() => {
      setCategories([]);
      setSubcategories([]);
    });
  }, []);

  useEffect(() => {
    const errors = validateSkillForm({
      skillName,
      description,
      category,
      subcategory,
    });
    setValidationErrors(errors);
  }, [skillName, description, category, subcategory]);

  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Получаем выбранную подкатегорию
  const selectedSubcategory = subcategories.find(
    (item) => item.id === subcategory,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsLoading(true);

    setTouched({
      skillName: true,
      description: true,
      category: true,
      subcategory: true,
    });

    const errors = validateSkillForm({
      skillName,
      description,
      category,
      subcategory,
    });
    setValidationErrors(errors);

    if (!isFormValid(errors)) {
      setIsLoading(false);
      return;
    }

    const newSkill: SkillTeach = {
      id: subcategory,
      categoryId: category,
      name: skillName.trim() || selectedSubcategory?.name || '',
      description: description.trim() || 'Пока не заполнено',
      length: 0,
    };

    // РЕЖИМ РЕДАКТИРОВАНИЯ
    if (isEditing && currentUser && skillIdToEdit) {
      const updatedSkills = currentUser.skillCanTeach?.map((skill) =>
        skill.id === skillIdToEdit ? newSkill : skill,
      ) || [newSkill];

      await updateUserInMockDb(currentUser.id, {
        skillCanTeach: updatedSkills,
      });
      updateUser({ ...currentUser, skillCanTeach: updatedSkills });

      navigate(`/skill/${newSkill.id}/${currentUser.id}`);
      setIsLoading(false);
      return;
    }

    // РЕЖИМ СОЗДАНИЯ (новый пользователь при регистрации)
    if (!isEditing && draft?.email && draft?.password) {
      // Для регистрации передаём skillCanTeach как ОДИН ОБЪЕКТ (не массив)
      // так как registerMockUser ожидает SkillTeach | undefined
      const singleSkill: SkillTeach = {
        id: subcategory,
        categoryId: category,
        name: skillName.trim() || selectedSubcategory?.name || '',
        description: description.trim() || 'Пока не заполнено',
        length: 0,
      };

      // Для черновика сохраняем как массив
      updateRegisterDraft({
        skillCanTeach: [singleSkill],
        about: description.trim() || undefined,
      });

      const result = await registerMockUser({
        email: draft.email,
        password: draft.password,
        name: draft.name,
        birthDate: draft.birthDate,
        gender: draft.gender,
        city: draft.city,
        skillToLearnId: draft.skillToLearnId,
        skillCanTeach: [singleSkill],
        about: description.trim() || undefined,
      });

      if (!result.ok) {
        setSubmitError('Email уже используется');
        setIsLoading(false);
        return;
      }

      const isLoggedIn = await login(draft.email, draft.password);
      if (!isLoggedIn) {
        setSubmitError('Не удалось выполнить автологин после регистрации');
        setIsLoading(false);
        return;
      }

      clearRegisterDraft();
      navigate(
        resolvePostAuthRedirect(
          (location.state as { from?: { pathname: string } } | null)?.from
            ?.pathname,
        ),
        { replace: true },
      );
      setIsLoading(false);
      return;
    }

    // РЕЖИМ СОЗДАНИЯ (авторизованный пользователь добавляет новый навык)
    if (currentUser) {
      const existingSkills = currentUser.skillCanTeach || [];
      const updatedSkills = [...existingSkills, newSkill];

      const success = await updateUserInMockDb(currentUser.id, {
        skillCanTeach: updatedSkills,
        ...(imageUrl
          ? { images: [...(currentUser.images || []), imageUrl] }
          : {}),
      });

      if (success) {
        // Обновляем пользователя в контексте
        const updatedUser = await getUserById(currentUser.id);
        if (updatedUser) updateUser(updatedUser);

        navigate(`/skill/${newSkill.id}/${currentUser.id}`);
      } else {
        setSubmitError('Не удалось создать навык');
      }
    }

    setIsLoading(false);
  };

  const handleBack = () => {
    if (isEditing) {
      navigate('/profile?tab=skills');
      return;
    }

    // Для черновика сохраняем как массив с обязательным полем length
    updateRegisterDraft({
      skillCanTeach: selectedSubcategory
        ? [
            {
              id: selectedSubcategory.id,
              categoryId: selectedSubcategory.categoryId,
              name: skillName.trim() || selectedSubcategory.name,
              description: description.trim() || 'Пока не заполнено',
              length: 0,
            },
          ]
        : undefined,
      about: description.trim() || undefined,
    });

    navigate('/register/step2', {
      state: location.state,
    });
  };

  const filteredSubcategories = subcategories.filter(
    (item) => item.categoryId === category,
  );

  const isSubmitDisabled = !isFormValid(validationErrors) || isLoading;

  // Функция для получения текста кнопки (без вложенного тернарника)
  const getButtonText = () => {
    if (isLoading) return 'Сохранение...';
    if (isEditing) return 'Сохранить изменения';
    return 'Продолжить';
  };

  return (
    <>
      <LoginHeader />
      <div className={styles.container}>
        {!isEditing && (
          <div className={styles['steps-indicator']}>
            <div className={styles['steps-text']}>Шаг 3 из 3</div>
            <div className={styles['steps-bar']}>
              <span className={`${styles['step-dot']} ${styles.completed}`} />
              <span className={`${styles['step-dot']} ${styles.completed}`} />
              <span className={`${styles['step-dot']} ${styles.active}`} />
            </div>
          </div>
        )}

        <div className={styles.content}>
          <div className={styles['form-column']}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <div className={styles.label}>Название навыка *</div>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  onBlur={() => handleFieldBlur('skillName')}
                  className={`${styles.input} ${
                    touched.skillName && validationErrors.skillName
                      ? styles['input-error']
                      : ''
                  }`}
                  placeholder="Введите название вашего навыка"
                  maxLength={MAX_TITLE_LENGTH}
                />
                <div className={styles['char-counter']}>
                  {skillName.length}/{MAX_TITLE_LENGTH}
                </div>
                {touched.skillName && validationErrors.skillName && (
                  <div className={styles['error-message']}>
                    {validationErrors.skillName}
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Категория навыка *</div>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory('');
                  }}
                  onBlur={() => handleFieldBlur('category')}
                  className={`${styles.select} ${
                    touched.category && validationErrors.category
                      ? styles['input-error']
                      : ''
                  }`}
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((categoryOption) => (
                    <option key={categoryOption.id} value={categoryOption.id}>
                      {categoryOption.icon} {categoryOption.name}
                    </option>
                  ))}
                </select>
                {touched.category && validationErrors.category && (
                  <div className={styles['error-message']}>
                    {validationErrors.category}
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Подкатегория навыка *</div>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  onBlur={() => handleFieldBlur('subcategory')}
                  className={`${styles.select} ${
                    touched.subcategory && validationErrors.subcategory
                      ? styles['input-error']
                      : ''
                  }`}
                  disabled={!category}
                >
                  <option value="">
                    {category
                      ? 'Выберите подкатегорию'
                      : 'Сначала выберите категорию'}
                  </option>
                  {filteredSubcategories.map((subcategoryOption) => (
                    <option
                      key={subcategoryOption.id}
                      value={subcategoryOption.id}
                    >
                      {subcategoryOption.name}
                    </option>
                  ))}
                </select>
                {touched.subcategory && validationErrors.subcategory && (
                  <div className={styles['error-message']}>
                    {validationErrors.subcategory}
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Описание</div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => handleFieldBlur('description')}
                  className={`${styles.textarea} ${
                    touched.description && validationErrors.description
                      ? styles['input-error']
                      : ''
                  }`}
                  placeholder="Коротко опишите, чему можете научить"
                  rows={4}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                />
                <div className={styles['char-counter']}>
                  {description.length}/{MAX_DESCRIPTION_LENGTH}
                </div>
                {touched.description && validationErrors.description && (
                  <div className={styles['error-message']}>
                    {validationErrors.description}
                  </div>
                )}
              </div>

              {/* Поле для URL изображения (опционально) */}
              <div className={styles.field}>
                <div className={styles.label}>Изображение навыка</div>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={styles.input}
                  placeholder="URL изображения (опционально)"
                />
                <div className={styles['char-counter']}>
                  Добавьте ссылку на изображение
                </div>
              </div>

              {submitError && (
                <div className={styles['error-message']}>{submitError}</div>
              )}

              <div className={styles['button-group']}>
                <button
                  type="button"
                  className={styles['button-secondary']}
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Назад
                </button>
                <button
                  type="submit"
                  className={styles['button-primary']}
                  disabled={isSubmitDisabled}
                >
                  {getButtonText()}
                </button>
              </div>
            </form>
          </div>

          <div className={styles['image-column']}>
            <img
              src={schoolBoardImage}
              alt="School board"
              className={styles.image}
            />
            <div className={styles['text-block']}>
              <h2 className={styles['welcome-title']}>
                {isEditing
                  ? 'Редактирование навыка'
                  : 'Укажите, чем вы готовы поделиться'}
              </h2>
              <p className={styles['welcome-text']}>
                {isEditing
                  ? 'Измените информацию о вашем навыке'
                  : 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Step3Form;
