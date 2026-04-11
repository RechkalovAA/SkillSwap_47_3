import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginHeader } from '../LoginPage/LoginHeader';
import styles from './Step2Form.module.css';
import userInfoImage from './user info.png';
import userCircleImage from './user-circle.png';
import { fetchCities } from '../../api/endpoints/citiesApi';
import {
  fetchCategories,
  fetchSubcategories,
} from '../../api/endpoints/skillsApi';
import type { Subcategory } from '../../entities/skill/model/types';
import {
  readRegisterDraft,
  updateRegisterDraft,
} from '../../features/auth/lib/registerDraft';

function Step2Form() {
  const navigate = useNavigate();
  const location = useLocation();
  const [draft] = useState(() => readRegisterDraft());

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    if (!draft?.email || !draft?.password) {
      navigate('/register', { replace: true, state: location.state });
      return;
    }

    setName(draft.name ?? '');
    setBirthDate(draft.birthDate ?? '');
    setGender(draft.gender ?? '');
    setCity(draft.city ?? '');
    setSubcategory(draft.skillToLearnId ?? '');
  }, [draft, navigate, location.state]);

  useEffect(() => {
    const loadOptions = async () => {
      const [nextCities, nextCategories, nextSubcategories] = await Promise.all(
        [fetchCities(), fetchCategories(), fetchSubcategories()],
      );

      setCities(nextCities);
      setCategories(nextCategories);
      setSubcategories(nextSubcategories);
    };

    loadOptions().catch(() => {
      setCities([]);
      setCategories([]);
      setSubcategories([]);
    });
  }, []);

  useEffect(() => {
    if (!subcategory) {
      return;
    }

    const selectedSubcategory = subcategories.find(
      (item) => item.id === subcategory,
    );
    if (selectedSubcategory) {
      setCategory(selectedSubcategory.categoryId);
    }
  }, [subcategory, subcategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedGender =
      gender === 'женский' || gender === 'мужской' ? gender : undefined;

    updateRegisterDraft({
      name,
      birthDate,
      gender: normalizedGender,
      city,
      skillToLearnId: subcategory || undefined,
    });

    navigate('/register/step3', {
      state: location.state,
    });
  };

  const handleBack = () => {
    const normalizedGender =
      gender === 'женский' || gender === 'мужской' ? gender : undefined;

    updateRegisterDraft({
      name,
      birthDate,
      gender: normalizedGender,
      city,
      skillToLearnId: subcategory || undefined,
    });

    navigate('/register', {
      state: location.state,
    });
  };

  const filteredSubcategories = subcategories.filter(
    (item) => item.categoryId === category,
  );

  return (
    <>
      <LoginHeader />
      <div className={styles.container}>
        <div className={styles['steps-indicator']}>
          <div className={styles['steps-text']}>Шаг 2 из 3</div>
          <div className={styles['steps-bar']}>
            <span className={`${styles['step-dot']} ${styles.completed}`} />
            <span className={`${styles['step-dot']} ${styles.active}`} />
            <span className={styles['step-dot']} />
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles['form-column']}>
            <div className={styles['avatar-wrapper']}>
              <div className={styles['avatar-container']}>
                <img
                  src={userCircleImage}
                  alt="Avatar"
                  className={styles['avatar-image']}
                />
                <div className={styles['avatar-badge']}>
                  <svg
                    className={styles['badge-icon']}
                    width="9"
                    height="9"
                    viewBox="0 0 9 9"
                    fill="none"
                  >
                    <line
                      x1="1.5"
                      y1="4.5"
                      x2="7.5"
                      y2="4.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1="4.5"
                      y1="1.5"
                      x2="4.5"
                      y2="7.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <div className={styles.label}>Имя</div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                  placeholder="Введите ваше имя"
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <div className={styles.label}>Дата рождения</div>
                  <input
                    type="text"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className={styles.input}
                    placeholder="дд.мм.гггг"
                  />
                </div>
                <div className={styles.field}>
                  <div className={styles.label}>Пол</div>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={styles.select}
                  >
                    <option value="">Не указан</option>
                    <option value="мужской">Мужской</option>
                    <option value="женский">Женский</option>
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Город</div>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Не указан</option>
                  {cities.map((cityOption) => (
                    <option key={cityOption} value={cityOption}>
                      {cityOption}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <div className={styles.label}>
                  Категория навыка, которому хотите научиться
                </div>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory('');
                  }}
                  className={styles.select}
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((categoryOption) => (
                    <option key={categoryOption.id} value={categoryOption.id}>
                      {categoryOption.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <div className={styles.label}>
                  Подкатегория навыка, которому хотите научиться
                </div>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className={styles.select}
                  disabled={!category}
                >
                  <option value="">Выберите подкатегорию</option>
                  {filteredSubcategories.map((subcategoryOption) => (
                    <option
                      key={subcategoryOption.id}
                      value={subcategoryOption.id}
                    >
                      {subcategoryOption.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles['button-group']}>
                <button
                  type="button"
                  className={styles['button-secondary']}
                  onClick={handleBack}
                >
                  Назад
                </button>
                <button type="submit" className={styles['button-primary']}>
                  Продолжить
                </button>
              </div>
            </form>
          </div>

          <div className={styles['image-column']}>
            <img src={userInfoImage} alt="User info" className={styles.image} />
            <div className={styles['text-block']}>
              <h2 className={styles['welcome-title']}>
                Расскажите немного о себе
              </h2>
              <p className={styles['welcome-text']}>
                Это поможет другим людям лучше вас узнать, чтобы выбрать для
                обмена
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Step2Form;
