import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';
import errorImage from './error 404.png';

function NotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Картинка */}
        <div className={styles['image-wrapper']}>
          <img
            src={errorImage}
            alt="404 error"
            className={styles['error-image']}
          />
        </div>

        {/* Текстовый блок */}
        <div className={styles['text-block']}>
          <h2 className={styles.subtitle}>Страница не найдена</h2>
          <p className={styles.description}>
            К сожалению, эта страница недоступна. Вернитесь на главную страницу
            или попробуйте позже.
          </p>
        </div>

        {/* Блок с кнопками */}
        <div className={styles.buttons}>
          <button className={styles['button-secondary']} type="button">
            Сообщить об ошибке
          </button>
          <Link to="/" className={styles['button-primary']}>
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

export { NotFoundPage };
