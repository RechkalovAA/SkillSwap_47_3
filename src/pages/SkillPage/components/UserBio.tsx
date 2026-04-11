// src/pages/SkillPage/components/UserBio.tsx
import styles from '../SkillPage.module.css';

interface UserBioProps {
  bio?: string;
}

export function UserBio({ bio }: UserBioProps) {
  if (!bio) return null;

  return (
    <div className={styles.userBio}>
      <p>{bio}</p>
    </div>
  );
}
