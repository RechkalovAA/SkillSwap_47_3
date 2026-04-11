import { useState } from 'react';
import styles from './Avatar.module.css';

export type AvatarSize = 'sm' | 'md' | 'lg';

type AvatarProps = {
  src?: string;
  name?: string;
  alt?: string;
  size?: AvatarSize;
};

function getInitials(name?: string): string {
  if (!name) return '?';

  const parts = name.trim().split(' ').filter(Boolean);

  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function Avatar({ src, name, alt, size }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const initials = getInitials(name);
  const showImage = Boolean(src) && !hasError;
  const sizeClass = styles[size ?? 'md'];

  return (
    <div
      className={`${styles.avatar} ${sizeClass}`}
      aria-label={name || alt || 'Avatar'}
    >
      {showImage ? (
        <img
          className={styles.image}
          src={src}
          alt={alt || name || 'Avatar'}
          onError={() => setHasError(true)}
        />
      ) : (
        <span className={styles.fallback}>{initials}</span>
      )}
    </div>
  );
}

Avatar.defaultProps = {
  src: undefined,
  name: undefined,
  alt: undefined,
  size: 'md' as AvatarSize,
};
