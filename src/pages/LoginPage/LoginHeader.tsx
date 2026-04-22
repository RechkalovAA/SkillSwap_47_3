import { Link, useLocation } from 'react-router-dom';
import {
  DEFAULT_REDIRECT_AFTER_LOGIN,
  resolvePostAuthRedirect,
} from '../../app/types/routes';
import styles from './LoginHeader.module.css';
import starIcon from './Star 6.png';

function LoginHeader() {
  const location = useLocation();
  const closeTarget = resolvePostAuthRedirect(
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? DEFAULT_REDIRECT_AFTER_LOGIN,
  );

  return (
    <header className={styles.header}>
      <div className={styles['header-content']}>
        <div className={styles.logo}>
          <div className={styles['logo-icon']}>
            <img src={starIcon} alt="Star" className={styles['star-icon']} />
          </div>
          <span className={styles['logo-text']}>SkillSwap</span>
        </div>
        <Link to={closeTarget} className={styles['close-button']}>
          <span className={styles['close-text']}>Закрыть</span>
          <div className={styles['close-icon-wrapper']}>
            <svg
              className={styles['close-icon']}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="#253017"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </Link>
      </div>
    </header>
  );
}

export { LoginHeader };
