// src/pages/SkillPage/components/UserInfo.tsx
import { Avatar } from '../../../shared/ui/Avatar';
import type { User } from '../../../entities/user/model/types';
import styles from '../SkillPage.module.css';

interface UserInfoProps {
  user: User;
}

export function UserInfo({ user }: UserInfoProps) {
  const avatarUrl = user.avatar ? `/avatars/${user.avatar}` : undefined;

  return (
    <div className={styles.userInfo}>
      <Avatar src={avatarUrl} name={user.name} size="lg" />
      <div className={styles.userDetails}>
        <h1 className={styles.userName}>{user.name}</h1>
        <p className={styles.userMeta}>
          {user.city && <span>{user.city}</span>}
          {user.city && user.age && <span className={styles.separator}>•</span>}
          {user.age && <span>{user.age} года</span>}
        </p>
      </div>
    </div>
  );
}
