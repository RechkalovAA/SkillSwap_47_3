/**
 * Константы маршрутов для всего MVP
 * Используются для навигации, редиректов и проверки прав доступа
 */

// ============ ПУБЛИЧНЫЕ МАРШРУТЫ ============

/**
 * Главная страница
 */
export const HOME_ROUTE = '/' as const;

/**
 * Страница авторизации
 */
export const LOGIN_ROUTE = '/login' as const;
export const REGISTER_ROUTE = '/register' as const;

// ============ МАРШРУТЫ СКИЛЛОВ ============

/**
 * Открывает карточку навыка
 * @param id - идентификатор навыка
 * @example `/skill/123`
 */
export const SKILL_ROUTE = (id: string | number) => `/skill/${id}` as const;

/**
 * Базовый путь для карточек навыков (для вложенных маршрутов)
 */
export const SKILL_BASE_ROUTE = '/skill' as const;

// ============ ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ ============

/**
 * Страница профиля пользователя
 */
export const PROFILE_ROUTE = '/profile' as const;

/**
 * Вложенные маршруты профиля
 */
export const PROFILE_EDIT_ROUTE = '/profile/edit' as const;
export const PROFILE_SETTINGS_ROUTE = '/profile/settings' as const;
export const PROFILE_SECURITY_ROUTE = '/profile/security' as const;

// ============ ИЗБРАННОЕ ============

/**
 * Страница избранных навыков/пользователей
 */
export const FAVORITES_ROUTE = '/favorites' as const;

// ============ СОЗДАНИЕ КОНТЕНТА ============

/**
 * Страница создания нового навыка/объявления
 */
export const CREATE_ROUTE = '/create' as const;

// ============ СТАТИЧЕСКИЕ СТРАНИЦЫ ============

/**
 * О проекте
 */
export const ABOUT_ROUTE = '/about' as const;

/**
 * Политика конфиденциальности
 */
export const PRIVACY_ROUTE = '/privacy' as const;

/**
 * Пользовательское соглашение
 */
export const USER_AGREEMENT_ROUTE = '/agreement' as const;

// ============ МАРШРУТЫ ДЛЯ ОШИБОК ============

/**
 * Страница 404 - не найдено
 */
export const NOT_FOUND_ROUTE = '/404' as const;

/**
 * Страница 500 - внутренняя ошибка сервера
 */
export const SERVER_ERROR_ROUTE = '/500' as const;

// ============ ВСПОМОГАТЕЛЬНЫЕ МАРШРУТЫ ============

/**
 * Редирект по умолчанию после авторизации
 */
export const DEFAULT_REDIRECT_AFTER_LOGIN = HOME_ROUTE;

/**
 * Редирект по умолчанию после выхода
 */
export const DEFAULT_REDIRECT_AFTER_LOGOUT = HOME_ROUTE;

// ============ ГРУППЫ МАРШРУТОВ ДЛЯ ПРОВЕРОК ============

/**
 * Маршруты, доступные только неавторизованным пользователям
 */
export const PUBLIC_ONLY_ROUTES = [LOGIN_ROUTE] as const;

/**
 * Маршруты, требующие авторизации
 */
export const PROTECTED_ROUTES = [
  PROFILE_ROUTE,
  PROFILE_EDIT_ROUTE,
  PROFILE_SETTINGS_ROUTE,
  PROFILE_SECURITY_ROUTE,
  FAVORITES_ROUTE,
  CREATE_ROUTE,
] as const;

/**
 * Все статические маршруты
 */
export const STATIC_ROUTES = [ABOUT_ROUTE, PRIVACY_ROUTE] as const;

/**
 * Маршруты с динамическими параметрами (требуют специальной проверки)
 */
export const DYNAMIC_ROUTES = [SKILL_BASE_ROUTE] as const;

// ============ ТИПЫ ДЛЯ ТИПИЗАЦИИ ============

/**
 * Тип для всех публичных маршрутов
 */
export type PublicRoute =
  | typeof HOME_ROUTE
  | typeof LOGIN_ROUTE
  | (typeof STATIC_ROUTES)[number];

/**
 * Тип для всех защищенных маршрутов
 */
export type ProtectedRoute = (typeof PROTECTED_ROUTES)[number];

/**
 * Тип для всех маршрутов приложения
 */
export type AppRoute =
  | PublicRoute
  | ProtectedRoute
  | typeof NOT_FOUND_ROUTE
  | typeof SERVER_ERROR_ROUTE;

// ============ ФУНКЦИИ-ПРОВЕРКИ ============

/**
 * Проверяет, является ли маршрут динамическим (содержит параметры)
 */
export const isDynamicRoute = (path: string): boolean =>
  DYNAMIC_ROUTES.some((route) => path.startsWith(route));

/**
 * Проверяет, требует ли маршрут авторизации
 */
export const isProtectedRoute = (path: string): boolean =>
  PROTECTED_ROUTES.some((route) => path === route || path.startsWith(route));

/**
 * Проверяет, доступен ли маршрут только неавторизованным
 */
export const isPublicOnlyRoute = (path: string): boolean =>
  PUBLIC_ONLY_ROUTES.includes(path as (typeof PUBLIC_ONLY_ROUTES)[number]);

// ============ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ============

/**
 * Формирует путь к профилю с возможным вложенным сегментом
 * @param segment - опциональный вложенный путь (edit, settings, security, notifications)
 */
export const getProfileRoute = (
  segment?: 'edit' | 'settings' | 'security' | 'notifications',
): string => {
  if (!segment) return PROFILE_ROUTE;
  return `/profile/${segment}`;
};

export const resolvePostAuthRedirect = (path?: string | null): string => {
  if (!path || path === LOGIN_ROUTE || path === REGISTER_ROUTE) {
    return DEFAULT_REDIRECT_AFTER_LOGIN;
  }

  return path;
};
