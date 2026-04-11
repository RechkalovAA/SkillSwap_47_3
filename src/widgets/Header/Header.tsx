import styles from './Header.module.css';
import logo from '../../assets/image/logo.svg';

interface HeaderGuestUIProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onSearch: (query: string) => void;
}

interface HeaderGuestProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onSearch?: (query: string) => void;
}

function HeaderGuestUI({
  onLoginClick,
  onRegisterClick,
  onSearch,
}: HeaderGuestUIProps) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav__menu}>
        <div className={styles.logo}>
          <img src={logo} alt="логотип SkillSwap" />
          <h1 className={styles.h1}>SkillSwap</h1>
        </div>

        <div className={styles.navLinksPlaceholder}>
          {/* TODO: Подключить компонент навигационных ссылок */}
        </div>

        <div className={styles.searchPlaceholder}>
          <input
            type="text"
            placeholder="Поиск"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className={styles.themeTogglePlaceholder}>
          {/* TODO: Подключить компонент переключения темы */}
        </div>

        <div className={styles.authButtonsPlaceholder}>
          <button type="button" onClick={onLoginClick}>
            Войти
          </button>
          <button type="button" onClick={onRegisterClick}>
            Зарегистрироваться
          </button>
        </div>
      </nav>
    </header>
  );
}

export function HeaderGuest({
  onLoginClick = () => {},
  onRegisterClick = () => {},
  onSearch = () => {},
}: HeaderGuestProps) {
  return (
    <HeaderGuestUI
      onLoginClick={onLoginClick}
      onRegisterClick={onRegisterClick}
      onSearch={onSearch}
    />
  );
}
