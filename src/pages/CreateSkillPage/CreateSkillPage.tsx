// /* eslint-disable jsx-a11y/label-has-associated-control */
// // src/pages/CreateSkillPage/CreateSkillPage.tsx
// import { useState, useEffect, useCallback, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../shared/hooks/useAuth';
// import {
//   fetchCategories,
//   fetchSubcategories,
//   saveSkillToMockDb,
// } from '../../api/endpoints/skillsApi';
// import { updateUserInMockDb } from '../../api/endpoints/usersApi';
// import type {
//   Category,
//   SkillTeach,
//   Subcategory,
// } from '../../entities/skill/model/types';
// import styles from './CreateSkillPage.module.css';

// interface FormData {
//   title: string;
//   description: string;
//   categoryId: string;
//   subcategoryId: string;
//   image: string;
//   tags: string[];
// }

// interface FormErrors {
//   title?: string;
//   description?: string;
//   categoryId?: string;
//   subcategoryId?: string;
//   tags?: string;
// }

// const MAX_TITLE_LENGTH = 50;
// const MIN_TITLE_LENGTH = 3;
// const MAX_DESCRIPTION_LENGTH = 500;
// const MIN_DESCRIPTION_LENGTH = 10;
// const MAX_TAGS = 5;
// const MAX_TAG_LENGTH = 20;

// export function CreateSkillPage() {
//   const navigate = useNavigate();
//   const { user, isAuth, isLoading: authLoading, updateUser } = useAuth();

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
//   const [filteredSubcategories, setFilteredSubcategories] = useState<
//     Subcategory[]
//   >([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [formData, setFormData] = useState<FormData>({
//     title: '',
//     description: '',
//     categoryId: '',
//     subcategoryId: '',
//     image: '',
//     tags: [],
//   });

//   const [tagInput, setTagInput] = useState('');
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [touched, setTouched] = useState<Record<string, boolean>>({});
//   const [submitError, setSubmitError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const categoriesData = await fetchCategories();
//         setCategories(categoriesData as unknown as Category[]);
//         const subcategoriesData = await fetchSubcategories();
//         setSubcategories(subcategoriesData);
//       } catch {
//         // Ошибка загрузки данных обрабатывается без console.error
//         setSubmitError('Не удалось загрузить данные формы');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   useEffect(() => {
//     if (formData.categoryId) {
//       const filtered = subcategories.filter(
//         (sub) => sub.categoryId === formData.categoryId,
//       );
//       setFilteredSubcategories(filtered);
//     } else {
//       setFilteredSubcategories([]);
//     }
//   }, [formData.categoryId, subcategories]);

//   const validateForm = useCallback((): FormErrors => {
//     const newErrors: FormErrors = {};

//     if (!formData.title.trim()) {
//       newErrors.title = 'Название навыка обязательно';
//     } else if (formData.title.length < MIN_TITLE_LENGTH) {
//       newErrors.title = `Название должно быть не менее ${MIN_TITLE_LENGTH} символов`;
//     } else if (formData.title.length > MAX_TITLE_LENGTH) {
//       newErrors.title = `Название не должно превышать ${MAX_TITLE_LENGTH} символов`;
//     }

//     if (!formData.description.trim()) {
//       newErrors.description = 'Описание навыка обязательно';
//     } else if (formData.description.length < MIN_DESCRIPTION_LENGTH) {
//       newErrors.description = `Описание должно быть не менее ${MIN_DESCRIPTION_LENGTH} символов`;
//     } else if (formData.description.length > MAX_DESCRIPTION_LENGTH) {
//       newErrors.description = `Описание не должно превышать ${MAX_DESCRIPTION_LENGTH} символов`;
//     }

//     if (!formData.categoryId) {
//       newErrors.categoryId = 'Выберите категорию';
//     }

//     if (!formData.subcategoryId) {
//       newErrors.subcategoryId = 'Выберите подкатегорию';
//     }

//     if (formData.tags.length === 0) {
//       newErrors.tags = 'Добавьте хотя бы один тег';
//     } else if (formData.tags.length > MAX_TAGS) {
//       newErrors.tags = `Не более ${MAX_TAGS} тегов`;
//     }

//     return newErrors;
//   }, [formData]);

//   useEffect(() => {
//     const newErrors = validateForm();
//     setErrors(newErrors);
//   }, [formData, validateForm]);

//   const isFormValid = useMemo(
//     () =>
//       Object.keys(errors).length === 0 &&
//       formData.title.trim() !== '' &&
//       formData.description.trim() !== '' &&
//       formData.categoryId !== '' &&
//       formData.subcategoryId !== '' &&
//       formData.tags.length > 0,
//     [errors, formData],
//   );

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >,
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setTouched((prev) => ({ ...prev, [name]: true }));
//   };

//   const handleAddTag = () => {
//     const trimmedTag = tagInput.trim().toLowerCase();

//     if (!trimmedTag) return;

//     if (trimmedTag.length > MAX_TAG_LENGTH) {
//       setErrors((prev) => ({
//         ...prev,
//         tags: `Тег не должен превышать ${MAX_TAG_LENGTH} символов`,
//       }));
//       return;
//     }

//     if (formData.tags.includes(trimmedTag)) {
//       setErrors((prev) => ({ ...prev, tags: 'Такой тег уже добавлен' }));
//       return;
//     }

//     if (formData.tags.length >= MAX_TAGS) {
//       setErrors((prev) => ({ ...prev, tags: `Не более ${MAX_TAGS} тегов` }));
//       return;
//     }

//     setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
//     setTagInput('');
//     setErrors((prev) => ({ ...prev, tags: undefined }));
//   };

//   const handleRemoveTag = (tagToRemove: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       tags: prev.tags.filter((tag) => tag !== tagToRemove),
//     }));
//   };

//   const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleAddTag();
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!isAuth || !user) {
//       setSubmitError('Необходимо авторизоваться');
//       return;
//     }

//     if (!isFormValid) {
//       setTouched({
//         title: true,
//         description: true,
//         categoryId: true,
//         subcategoryId: true,
//         tags: true,
//       });
//       return;
//     }

//     setIsSubmitting(true);
//     setSubmitError(null);

//     try {
//       const selectedSubcategory = subcategories.find(
//         (sub) => sub.id === formData.subcategoryId,
//       );

//       if (!selectedSubcategory) {
//         throw new Error('Подкатегория не найдена');
//       }

//       const newSkillId = `skill_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

//       const newSkill: SkillTeach = {
//         id: newSkillId,
//         categoryId: formData.categoryId,
//         name: formData.title,
//         description: formData.description,
//         length: 0,
//       };

//       await saveSkillToMockDb({
//         id: newSkillId,
//         categoryId: formData.categoryId,
//         name: formData.title,
//         description: formData.description,
//         tags: formData.tags,
//         image: formData.image || undefined,
//         createdAt: new Date().toISOString(),
//         userId: user.id,
//       });

//       // ✅ Добавляем новый навык в массив существующих
//       // eslint-disable-next-line no-nested-ternary
//       const currentSkills = Array.isArray(user.skillCanTeach)
//         ? user.skillCanTeach
//         : user.skillCanTeach
//           ? [user.skillCanTeach]
//           : [];
//       const updatedUser = {
//         ...user,
//         skillCanTeach: [...currentSkills, newSkill], // массив навыков
//         images: formData.image
//           ? [...(user.images || []), formData.image]
//           : user.images,
//       };

//       // Сохраняем в MockDb (только обновлённые поля)
//       await updateUserInMockDb(user.id, {
//         skillCanTeach: updatedUser.skillCanTeach,
//       });

//       // Обновляем контекст авторизации
//       updateUser(updatedUser);

//       // Перенаправляем на страницу созданного навыка
//       navigate(`/skill/${newSkillId}/${user.id}`);
//     } catch (error) {
//       console.error('Error creating skill:', error);
//       setSubmitError('Не удалось создать навык. Попробуйте ещё раз.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Перенаправление, если не авторизован
//   if (!authLoading && !isAuth) {
//     navigate('/login', { state: { from: { pathname: '/create' } } });
//     return null;
//   }

//   if (authLoading || isLoading) {
//     return (
//       <div className={styles['create-skill-page']}>
//         <div className={styles['create-skill-loading']}>Загрузка...</div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles['create-skill-page']}>
//       <div className={styles['create-skill-container']}>
//         <h1 className={styles['create-skill-title']}>Создание навыка</h1>

//         <form onSubmit={handleSubmit} className={styles['create-skill-form']}>
//           {/* Поле Название */}
//           <div className={styles['form-group']}>
//             <label htmlFor="skill-title" className={styles['form-label']}>
//               Название навыка <span className={styles['form-required']}>*</span>
//             </label>
//             <input
//               type="text"
//               id="skill-title"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
//               className={`${styles['form-input']} ${touched.title && errors.title ? styles['form-input-error'] : ''}`}
//               placeholder="Например: Игра на гитаре"
//               maxLength={MAX_TITLE_LENGTH}
//               aria-invalid={!!(touched.title && errors.title)}
//               aria-describedby={
//                 touched.title && errors.title ? 'skill-title-error' : undefined
//               }
//             />
//             {touched.title && errors.title && (
//               <div
//                 id="skill-title-error"
//                 className={styles['form-error']}
//                 role="alert"
//               >
//                 {errors.title}
//               </div>
//             )}
//             <div className={styles['form-hint']}>
//               {formData.title.length}/{MAX_TITLE_LENGTH} символов
//             </div>
//           </div>

//           {/* Поле Описание */}
//           <div className={styles['form-group']}>
//             <label htmlFor="skill-description" className={styles['form-label']}>
//               Описание <span className={styles['form-required']}>*</span>
//             </label>
//             <textarea
//               id="skill-description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               onBlur={() =>
//                 setTouched((prev) => ({ ...prev, description: true }))
//               }
//               className={`${styles['form-textarea']} ${touched.description && errors.description ? styles['form-input-error'] : ''}`}
//               placeholder="Расскажите о вашем навыке, опыте и как вы можете помочь другим"
//               rows={5}
//               maxLength={MAX_DESCRIPTION_LENGTH}
//               aria-invalid={!!(touched.description && errors.description)}
//               aria-describedby={
//                 touched.description && errors.description
//                   ? 'skill-description-error'
//                   : undefined
//               }
//             />
//             {touched.description && errors.description && (
//               <div
//                 id="skill-description-error"
//                 className={styles['form-error']}
//                 role="alert"
//               >
//                 {errors.description}
//               </div>
//             )}
//             <div className={styles['form-hint']}>
//               {formData.description.length}/{MAX_DESCRIPTION_LENGTH} символов
//             </div>
//           </div>

//           {/* Поле Категория */}
//           <div className={styles['form-group']}>
//             <label htmlFor="skill-category" className={styles['form-label']}>
//               Категория <span className={styles['form-required']}>*</span>
//             </label>
//             <select
//               id="skill-category"
//               name="categoryId"
//               value={formData.categoryId}
//               onChange={handleChange}
//               onBlur={() =>
//                 setTouched((prev) => ({ ...prev, categoryId: true }))
//               }
//               className={`${styles['form-select']} ${touched.categoryId && errors.categoryId ? styles['form-input-error'] : ''}`}
//               aria-invalid={!!(touched.categoryId && errors.categoryId)}
//               aria-describedby={
//                 touched.categoryId && errors.categoryId
//                   ? 'skill-category-error'
//                   : undefined
//               }
//             >
//               <option value="">Выберите категорию</option>
//               {categories.map((category) => (
//                 <option key={category.id} value={category.id}>
//                   {category.icon} {category.name}
//                 </option>
//               ))}
//             </select>
//             {touched.categoryId && errors.categoryId && (
//               <div
//                 id="skill-category-error"
//                 className={styles['form-error']}
//                 role="alert"
//               >
//                 {errors.categoryId}
//               </div>
//             )}
//           </div>

//           {/* Поле Подкатегория */}
//           <div className={styles['form-group']}>
//             <label htmlFor="skill-subcategory" className={styles['form-label']}>
//               Подкатегория <span className={styles['form-required']}>*</span>
//             </label>
//             <select
//               id="skill-subcategory"
//               name="subcategoryId"
//               value={formData.subcategoryId}
//               onChange={handleChange}
//               onBlur={() =>
//                 setTouched((prev) => ({ ...prev, subcategoryId: true }))
//               }
//               className={`${styles['form-select']} ${touched.subcategoryId && errors.subcategoryId ? styles['form-input-error'] : ''}`}
//               disabled={!formData.categoryId}
//               aria-invalid={!!(touched.subcategoryId && errors.subcategoryId)}
//               aria-describedby={
//                 touched.subcategoryId && errors.subcategoryId
//                   ? 'skill-subcategory-error'
//                   : undefined
//               }
//             >
//               <option value="">
//                 {formData.categoryId
//                   ? 'Выберите подкатегорию'
//                   : 'Сначала выберите категорию'}
//               </option>
//               {filteredSubcategories.map((sub) => (
//                 <option key={sub.id} value={sub.id}>
//                   {sub.name}
//                 </option>
//               ))}
//             </select>
//             {touched.subcategoryId && errors.subcategoryId && (
//               <div
//                 id="skill-subcategory-error"
//                 className={styles['form-error']}
//                 role="alert"
//               >
//                 {errors.subcategoryId}
//               </div>
//             )}
//           </div>

//           {/* Поле Теги */}
//           <div className={styles['form-group']}>
//             <label className={styles['form-label']}>
//               Теги <span className={styles['form-required']}>*</span>
//             </label>

//             {/* Контейнер для ввода тега */}
//             <div className={styles['tags-input-container']}>
//               <input
//                 type="text"
//                 value={tagInput}
//                 onChange={(e) => setTagInput(e.target.value)}
//                 onKeyDown={handleTagKeyDown}
//                 className={styles['tags-input-field']}
//                 placeholder={
//                   formData.tags.length >= MAX_TAGS
//                     ? 'Максимум тегов добавлено'
//                     : 'Введите тег и нажмите Enter'
//                 }
//                 disabled={formData.tags.length >= MAX_TAGS}
//               />
//             </div>

//             {/* Отображение добавленных тегов */}
//             <div className={styles['tags-wrapper']}>
//               {formData.tags.length === 0 ? (
//                 <span className={styles['tags-empty']}>Теги не добавлены</span>
//               ) : (
//                 formData.tags.map((tag) => (
//                   <span key={tag} className={styles.tag}>
//                     {tag}
//                     <button
//                       type="button"
//                       className={styles['tag-remove']}
//                       onClick={() => handleRemoveTag(tag)}
//                       aria-label={`Удалить тег ${tag}`}
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ))
//               )}
//             </div>

//             {errors.tags && (
//               <div className={styles['form-error']} role="alert">
//                 {errors.tags}
//               </div>
//             )}
//             <div className={styles['form-hint']}>
//               Теги помогают другим пользователям найти ваш навык. Максимум{' '}
//               {MAX_TAGS} тегов.
//             </div>
//           </div>

//           {/* Поле Изображение (опционально) */}
//           <div className={styles['form-group']}>
//             <label htmlFor="skill-image" className={styles['form-label']}>
//               Изображение
//             </label>
//             <input
//               type="text"
//               id="skill-image"
//               name="image"
//               value={formData.image}
//               onChange={handleChange}
//               className={styles['form-input']}
//               placeholder="URL изображения (опционально)"
//             />
//             <div className={styles['form-hint']}>
//               Добавьте ссылку на изображение, иллюстрирующее ваш навык
//             </div>
//           </div>

//           {submitError && (
//             <div className={styles['form-submit-error']} role="alert">
//               {submitError}
//             </div>
//           )}

//           <div className={styles['form-actions']}>
//             <button
//               type="button"
//               className={styles['form-button-cancel']}
//               onClick={() => navigate('/catalog')}
//             >
//               Отмена
//             </button>
//             <button
//               type="submit"
//               className={styles['form-button-submit']}
//               disabled={isSubmitting || !isFormValid}
//               aria-busy={isSubmitting}
//             >
//               {isSubmitting ? 'Создание...' : 'Создать навык'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
