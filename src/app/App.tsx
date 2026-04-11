import { Suspense, lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { HeaderGuest } from '../widgets/Header';
import { Footer } from '../widgets/Footer';
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { SkillPage } from '../pages/SkillPage/SkillPage';
import { RegisterPage } from '../pages/RegisterPage/RegisterPage';
import Step2Form from '../pages/RegisterPage2/Step2Form';
import Step3Form from '../pages/RegisterPage3/Step3Form';

const CatalogPage = lazy(() => import('../pages/CatalogPage/CatalogPage'));

// Компонент Layout
function Layout() {
  return (
    <div className="app">
      <HeaderGuest />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
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

// function SkillPage() {
//   return (
//     <div className="container">
//       <h1>Страница навыка</h1>
//       <p>Здесь будет детальная информация о навыке</p>
//     </div>
//   );
// }

function CreateSkillPage() {
  return (
    <div className="container">
      <h1>Создание навыка</h1>
      <p>Здесь будет форма создания нового навыка</p>
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

function ContactsPage() {
  return (
    <div className="container">
      <h1>Контакты</h1>
      <p>Свяжитесь с нами</p>
    </div>
  );
}

function BlogPage() {
  return (
    <div className="container">
      <h1>Блог</h1>
      <p>Новости и статьи</p>
    </div>
  );
}

function TermsPage() {
  return (
    <div className="container">
      <h1>Пользовательское соглашение</h1>
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

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Страницы с общим хедером и футером */}
        <Route path="/" element={<Layout />}>
          <Route index element={<CatalogPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="skill/:id" element={<SkillPage />} />
          <Route path="create" element={<CreateSkillPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
        </Route>

        {/* Страницы со своим хедером (без общего Layout) */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="register/step2" element={<Step2Form />} />
        <Route path="register/step3" element={<Step3Form />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
