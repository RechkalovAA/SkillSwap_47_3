/* eslint-disable react/require-default-props */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import logoIcon from '../../assets/images/logo.svg';
import { useAuth } from '../../shared/hooks/useAuth';

interface HeaderGuestUIProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onSearch?: (query: string) => void;
}

type HeaderAuthUIProps = {
  userName: string;
  onProfileClick: () => void;
  onLogoutClick: () => void;
  onSearch?: (query: string) => void;
};

function HeaderGuestUI({
  onLoginClick = () => {},
  onRegisterClick = () => {},
  onSearch = () => {},
}: HeaderGuestUIProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles['nav-menu']}>
          <div className={styles.logo}>
            <Link to="/" className={styles['logo-link']}>
              <img
                src={logoIcon}
                alt="логотип SkillSwap"
                className={styles['logo-icon']}
              />
              <h1 className={styles.h1}>SkillSwap</h1>
            </Link>
          </div>

          <div className={styles['nav-links']}>
            <ul className={styles['nav-list']}>
              <li>
                <Link to="/about" className={styles['nav-link']}>
                  О проекте
                </Link>
              </li>
              <li>
                <Link to="/catalog" className={styles['nav-link']}>
                  Все навыки
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles['search-wrapper']}>
            <input
              type="text"
              placeholder="Искать навык"
              className={styles['search-input']}
              onChange={handleSearch}
            />
          </div>

          <div className={styles['theme-toggle']}>
            <button
              type="button"
              className={styles['theme-button']}
              aria-label="Переключить тему"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.4255 20C10.2674 20 10.1092 20 9.95112 19.9907C4.74232 19.7582 0.389249 15.5632 0.0264936 10.4474C-0.289755 6.05715 2.24954 1.95522 6.34216 0.234459C7.50484 -0.249215 8.11874 0.122842 8.37918 0.392583C8.63962 0.653023 9.00237 1.25762 8.5187 2.36449C8.09083 3.35044 7.8769 4.4015 7.8862 5.48047C7.90481 9.601 11.3277 13.0983 15.5041 13.2658C16.1087 13.2937 16.704 13.2472 17.2806 13.1448C18.5084 12.9216 19.02 13.4146 19.2153 13.7308C19.4107 14.0471 19.6339 14.7261 18.8898 15.7306C16.9179 18.4281 13.7833 20 10.4255 20ZM1.41241 10.3451C1.72866 14.7726 5.50504 18.4002 10.0069 18.5955C13.0671 18.7443 15.9691 17.3491 17.755 14.9121C17.8945 14.7168 17.9597 14.5773 17.9876 14.5029C17.9038 14.4936 17.755 14.4843 17.5225 14.5308C16.8435 14.6517 16.1366 14.6982 15.439 14.6703C10.5278 14.475 6.50959 10.3544 6.48169 5.49907C6.48169 4.21547 6.73283 2.97838 7.2444 1.8157C7.33742 1.61107 7.35602 1.47155 7.36532 1.39714C7.28161 1.39714 7.13279 1.41574 6.89095 1.51806C3.3471 3.00629 1.15197 6.55943 1.41241 10.3451Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          <div className={styles['auth-buttons']}>
            <button
              type="button"
              className={`${styles.button} ${styles['button-outline']}`}
              onClick={onLoginClick}
            >
              Войти
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles['button-primary']}`}
              onClick={onRegisterClick}
            >
              Зарегистрироваться
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

function HeaderAuthUI({
  userName,
  onProfileClick,
  onLogoutClick,
  onSearch = () => {},
}: HeaderAuthUIProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles['nav-menu']}>
          <div className={styles.logo}>
            <Link to="/" className={styles['logo-link']}>
              <img
                src={logoIcon}
                alt="логотип SkillSwap"
                className={styles['logo-icon']}
              />
              <h1 className={styles.h1}>SkillSwap</h1>
            </Link>
          </div>

          <div className={styles['nav-links']}>
            <ul className={styles['nav-list']}>
              <li>
                <Link to="/about" className={styles['nav-link']}>
                  О проекте
                </Link>
              </li>
              <li>
                <Link to="/catalog" className={styles['nav-link']}>
                  Все навыки
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles['search-wrapper']}>
            <input
              type="text"
              placeholder="Искать навык"
              className={styles['search-input']}
              onChange={handleSearch}
            />
          </div>

          <div className={styles['theme-toggle']}>
            <button
              type="button"
              className={styles['theme-button']}
              aria-label="Переключить тему"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.4255 20C10.2674 20 10.1092 20 9.95112 19.9907C4.74232 19.7582 0.389249 15.5632 0.0264936 10.4474C-0.289755 6.05715 2.24954 1.95522 6.34216 0.234459C7.50484 -0.249215 8.11874 0.122842 8.37918 0.392583C8.63962 0.653023 9.00237 1.25762 8.5187 2.36449C8.09083 3.35044 7.8769 4.4015 7.8862 5.48047C7.90481 9.601 11.3277 13.0983 15.5041 13.2658C16.1087 13.2937 16.704 13.2472 17.2806 13.1448C18.5084 12.9216 19.02 13.4146 19.2153 13.7308C19.4107 14.0471 19.6339 14.7261 18.8898 15.7306C16.9179 18.4281 13.7833 20 10.4255 20ZM1.41241 10.3451C1.72866 14.7726 5.50504 18.4002 10.0069 18.5955C13.0671 18.7443 15.9691 17.3491 17.755 14.9121C17.8945 14.7168 17.9597 14.5773 17.9876 14.5029C17.9038 14.4936 17.755 14.4843 17.5225 14.5308C16.8435 14.6517 16.1366 14.6982 15.439 14.6703C10.5278 14.475 6.50959 10.3544 6.48169 5.49907C6.48169 4.21547 6.73283 2.97838 7.2444 1.8157C7.33742 1.61107 7.35602 1.47155 7.36532 1.39714C7.28161 1.39714 7.13279 1.41574 6.89095 1.51806C3.3471 3.00629 1.15197 6.55943 1.41241 10.3451Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          <div className={styles['auth-buttons']}>
            <span className={styles['user-name']}>{userName}</span>
            <button
              type="button"
              className={`${styles.button} ${styles['button-outline']}`}
              onClick={onProfileClick}
            >
              Профиль
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles['button-primary']}`}
              onClick={onLogoutClick}
            >
              Выйти
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function HeaderGuest({
  onLoginClick,
  onRegisterClick,
  onSearch,
}: HeaderGuestUIProps) {
  const navigate = useNavigate();
  const { isAuth, user, logout } = useAuth();

  if (isAuth && user) {
    return (
      <HeaderAuthUI
        userName={user.name}
        onProfileClick={() => navigate('/profile')}
        onLogoutClick={() => {
          logout();
          navigate('/', { replace: true });
        }}
        onSearch={onSearch}
      />
    );
  }

  return (
    <HeaderGuestUI
      onLoginClick={onLoginClick ?? (() => navigate('/login'))}
      onRegisterClick={onRegisterClick ?? (() => navigate('/register'))}
      onSearch={onSearch}
    />
  );
}
