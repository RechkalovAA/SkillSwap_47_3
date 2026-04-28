// // src/widgets/SkillCard/SkillCard.tsx (дополнение к существующему)
// import { Link } from 'react-router-dom';
// import { Avatar } from '../../shared/ui/Avatar';
// import { Button } from '../../shared/ui/Button';
// import type { User } from '../../entities/user/model/types';
// import styles from './SkillCard.module.css';
// import { TSkillVariant } from '../../shared/ui/Tag/tagUi';
// import { SkillName } from '../../shared/ui/SkillName/SkillName';

// interface SkillCardProps {
//   user: User;
//   variant?: 'default' | 'compact';
//   hideButton?: boolean;
//   activeSkillId?: string; // Добавляем пропс для активного навыка
// }

// function getAgeSuffix(age: number): string {
//   if (age % 10 === 1 && age % 100 !== 11) return 'год';
//   if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100))
//     return 'года';
//   return 'лет';
// }

// // Функция для определения варианта тега по категории
// export function getCategoryVariant(categoryId: string): TSkillVariant {
//   const variants: Record<string, TSkillVariant> = {
//     '1': 'business',
//     '2': 'creative',
//     '3': 'languages',
//     '4': 'education',
//     '5': 'home',
//     '6': 'health',
//   };
//   return variants[categoryId] || 'other';
// }

// export function SkillCard({
//   user,
//   variant = 'default',
//   hideButton = false,
//   activeSkillId
// }: SkillCardProps) {
//   const skillsToLearn = user.skills?.slice(0, 3) || [];
//   const remainingCount = (user.skills?.length || 0) - 3;

//   // Если указан activeSkillId, показываем конкретный навык
//   // Иначе показываем первый из массива
//   const displayTeachSkill = activeSkillId
//     ? user.skillCanTeach?.find(skill => skill.id === activeSkillId)
//     : user.skillCanTeach?.[0];

//   const isCompact = variant === 'compact';

//   return (
//     <div className={`${styles['skill-card']} ${isCompact ? styles['skill-card-compact'] : ''}`}>
//       <div className={styles['skill-card-header']}>
//         <Avatar
//           src={`/avatars/${user.avatar}`}
//           name={user.name}
//           size={isCompact ? 'md' : 'lg'}
//         />
//         <div className={styles['skill-card-info']}>
//           <h3 className={styles['skill-card-name']}>{user.name}</h3>
//           <p className={styles['skill-card-location']}>
//             {user.city}, {user.age} {getAgeSuffix(user.age)}
//           </p>
//         </div>
//       </div>

//       {/* Блок "Может научить" - показываем конкретный навык */}
//       <div className={styles['skill-card-skills']}>
//         <h3 className={styles['skill-card-skills-label']}>Может научить:</h3>
//         <div className={styles['skill-card-skills-list']}>
//           {displayTeachSkill && (
//             <span className={styles['skill-card-skill-tag']}>
//               {displayTeachSkill.name}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Блок "Хочет научиться" - только для дефолтного варианта */}
//       {!isCompact && (
//         <div className={styles['skill-card-skills']}>
//           <h3 className={styles['skill-card-skills-label']}>Хочет научиться:</h3>
//           <div className={styles['skill-card-skills-list']}>
//             {skillsToLearn.map((skillId) => (
//               <span key={skillId} className={styles['skill-card-skill-tag']}>
//                 <SkillName skillId={skillId} />
//               </span>
//             ))}
//             {remainingCount > 0 && (
//               <span className={styles['skill-card-skill-tag']}>
//                 +{remainingCount}
//               </span>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Кнопка "Смотреть" - скрываем если hideButton=true */}
//       {!hideButton && displayTeachSkill && (
//         <Link to={`/skill/${displayTeachSkill.id}/${user.id}`}>
//           <Button variant="secondary" size="md" className={styles['skill-card-button']}>
//             Смотреть
//           </Button>
//         </Link>
//       )}
//     </div>
//   );
// }
