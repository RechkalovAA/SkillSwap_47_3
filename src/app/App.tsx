import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';

// Компонент Header
function Header() {
  return (
    <header className="app-header">
      <div className="container">
        <div className="app-header-content">
          <div className="app-header-logo">
            <Link to="/" className="app-header-logo-link">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="app-header-logo-icon"
              >
                <rect width="40" height="40" rx="20" fill="#ABD27A" />
                <path
                  d="M20 10C20 10 20.5518 15.1499 22.7009 17.2991C24.8501 19.4482 30 20 30 20C30 20 24.8501 20.5518 22.7009 22.7009C20.5518 24.8501 20 30 20 30C20 30 19.4482 24.8501 17.2991 22.7009C15.1499 20.5518 10 20 10 20C10 20 15.1499 19.4482 17.2991 17.2991C19.4482 15.1499 20 10 20 10Z"
                  fill="#F9FAF7"
                />
              </svg>
              <h1 className="app-header-title">SkillSwap</h1>
            </Link>
          </div>

          <nav className="app-header-nav">
            <ul className="app-header-nav-list">
              <li>
                <Link to="/about" className="app-header-nav-link">
                  О проекте
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="app-header-nav-link">
                  Все навыки
                </Link>
              </li>
              {/* <li>
                <Link to="/favorites" className="app-header-nav-link">
                  Избранное
                </Link>
							 TODO: по макету не поняла где будут находится избранные карточки
              </li> */}
            </ul>
          </nav>

          <div className="app-header-search">
            <input
              type="text"
              placeholder="Искать навык"
              className="app-header-search-input"
            />
          </div>

          <div className="app-header-actions">
            <button
              type="button"
              className="app-header-theme-toggle"
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
            <button
              type="button"
              className="app-header-button app-header-button-outline"
            >
              Войти
            </button>
            <button
              type="button"
              className="app-header-button app-header-button-primary"
            >
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="container">
        <div className="app-footer-grid">
          {/* Колонка 1: Логотип */}
          <div className="app-footer-col">
            <Link to="/" className="app-footer-logo-link">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="app-footer-logo-icon"
              >
                <rect width="40" height="40" rx="20" fill="#ABD27A" />
                <path
                  d="M20 10C20 10 20.5518 15.1499 22.7009 17.2991C24.8501 19.4482 30 20 30 20C30 20 24.8501 20.5518 22.7009 22.7009C20.5518 24.8501 20 30 20 30C20 30 19.4482 24.8501 17.2991 22.7009C15.1499 20.5518 10 20 10 20C10 20 15.1499 19.4482 17.2991 17.2991C19.4482 15.1499 20 10 20 10Z"
                  fill="#F9FAF7"
                />
              </svg>
              <span className="app-footer-title">SkillSwap</span>
            </Link>
          </div>

          {/* Колонка 2: О проекте и Все навыки */}
          <div className="app-footer-col">
            <ul className="app-footer-nav-list">
              <li>
                <Link to="/about" className="app-footer-nav-link">
                  О проекте
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="app-footer-nav-link">
                  Все навыки
                </Link>
              </li>
            </ul>
          </div>

          {/* Колонка 3: Контакты и Блог */}
          <div className="app-footer-col">
            <ul className="app-footer-nav-list">
              <li>
                <Link to="/contacts" className="app-footer-nav-link">
                  Контакты
                </Link>
              </li>
              <li>
                <Link to="/blog" className="app-footer-nav-link">
                  Блог
                </Link>
              </li>
            </ul>
          </div>

          {/* Колонка 4: Политика конфиденциальности и Пользовательское соглашение */}
          <div className="app-footer-col">
            <ul className="app-footer-nav-list">
              <li>
                <Link to="/privacy" className="app-footer-nav-link">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link to="/terms" className="app-footer-nav-link">
                  Пользовательское соглашение
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Копирайт */}
        <div className="app-footer-copyright">
          <p>© {currentYear} SkillSwap - 2026</p>
        </div>
      </div>
    </footer>
  );
}

// Компонент Layout
function Layout() {
  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Временные компоненты страниц
function CatalogPage() {
  return (
    <div className="container">
      <h1>Каталог навыков</h1>
      <p>Здесь будет отображаться список всех навыков</p>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="container">
      <h1>Профиль пользователя</h1>
      <p>Здесь будет информация о пользователе</p>
    </div>
  );
}

function FavoritesPage() {
  return (
    <div className="container">
      <h1>Избранное</h1>
      <p>Здесь будут сохраненные навыки</p>
    </div>
  );
}

function SkillPage() {
  return (
    <div className="container">
      <h1>Страница навыка</h1>
      <p>Здесь будет детальная информация о навыке</p>
    </div>
  );
}

function CreateSkillPage() {
  return (
    <div className="container">
      <h1>Создание навыка</h1>
      <p>Здесь будет форма создания нового навыка</p>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="container">
      <h1>Вход</h1>
      <p>Здесь будет форма входа</p>
    </div>
  );
}

function RegisterPage() {
  return (
    <div className="container">
      <h1>Регистрация</h1>
      <p>Здесь будет форма регистрации</p>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="container">
      <h1>О проекте</h1>
      <p>SkillSwap — платформа обмена навыками</p>
    </div>
  );
}

function TermsPage() {
  return (
    <div className="container">
      <h1>Условия использования</h1>
      <p>Условия использования сервиса SkillSwap</p>
    </div>
  );
}

function PrivacyPage() {
  return (
    <div className="container">
      <h1>Политика конфиденциальности</h1>
      <p>Политика конфиденциальности сервиса SkillSwap</p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="container">
      <h1>404 - Страница не найдена</h1>
      <p>Запрашиваемая страница не существует</p>
      <Link to="/" className="button button-primary">
        Вернуться на главную
      </Link>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CatalogPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="skill/:id" element={<SkillPage />} />
          <Route path="create" element={<CreateSkillPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
