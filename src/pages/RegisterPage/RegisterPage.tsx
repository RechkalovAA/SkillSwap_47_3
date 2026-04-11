import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoginHeader } from '../LoginPage/LoginHeader';
import styles from './RegisterPage.module.css';
import lightBulbImage from '../LoginPage/light-bulb.png';
import googleIcon from '../LoginPage/Google.png';
import appleIcon from '../LoginPage/Apple.png';
import eyeIcon from '../LoginPage/eye.png';
import { useAuth } from '../../shared/hooks/useAuth';
import {
  DEFAULT_REDIRECT_AFTER_LOGIN,
  resolvePostAuthRedirect,
} from '../../app/types/routes';
import { isRegistrationEmailTaken } from '../../features/auth/api/registerMockUser';
import { writeRegisterDraft } from '../../features/auth/lib/registerDraft';

function RegisterPage() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showHint, setShowHint] = useState(true);

  const from = resolvePostAuthRedirect(
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? DEFAULT_REDIRECT_AFTER_LOGIN,
  );

  const checkPasswordStrength = (pwd: string) => {
    if (pwd.length >= 8) {
      setPasswordStrength('Надёжный');
      setShowHint(false);
    } else {
      setPasswordStrength('');
      setShowHint(true);
    }
  };

  useEffect(() => {
    if (isAuth) {
      navigate(from, { replace: true });
    }
  }, [isAuth, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setSubmitError('');

    if (password.length < 8) {
      setSubmitError('Пароль должен содержать не менее 8 знаков');
      return;
    }

    try {
      const emailTaken = await isRegistrationEmailTaken(email);
      if (emailTaken) {
        setEmailError('Email уже используется');
        return;
      }

      writeRegisterDraft({
        email,
        password,
      });

      navigate('/register/step2', {
        state: location.state,
      });
    } catch {
      setSubmitError('Ошибка регистрации. Попробуйте ещё раз.');
    }
  };

  if (isAuth) {
    return null;
  }

  return (
    <>
      <LoginHeader />
      <div className={styles.container}>
        <div className={styles['steps-indicator']}>
          <div className={styles['steps-text']}>Шаг 1 из 3</div>
          <div className={styles['steps-bar']}>
            <span className={`${styles['step-dot']} ${styles.active}`} />
            <span className={styles['step-dot']} />
            <span className={styles['step-dot']} />
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles['form-column']}>
            <div className={styles.block1}>
              <div className={styles['social-buttons']}>
                <button type="button" className={styles['social-button']}>
                  <img
                    src={googleIcon}
                    alt="Google"
                    className={styles['social-icon']}
                  />
                  <span className={styles['social-text']}>
                    Продолжить с Google
                  </span>
                </button>
                <button type="button" className={styles['social-button']}>
                  <img
                    src={appleIcon}
                    alt="Apple"
                    className={styles['social-icon']}
                  />
                  <span className={styles['social-text']}>
                    Продолжить с Apple
                  </span>
                </button>
              </div>

              <div className={styles.divider}>
                <span className={styles['divider-line']} />
                <span className={styles['divider-text']}>или</span>
                <span className={styles['divider-line']} />
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                  <div className={styles.label}>Email</div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                      setSubmitError('');
                    }}
                    className={`${styles.input} ${emailError ? styles['input-error'] : ''}`}
                    placeholder="Введите email"
                    required
                  />
                  {emailError && (
                    <div className={styles['error-message']}>{emailError}</div>
                  )}
                </div>

                <div className={styles.field}>
                  <div className={styles.label}>Пароль</div>
                  <div className={styles['password-wrapper']}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setSubmitError('');
                        checkPasswordStrength(e.target.value);
                      }}
                      className={styles['password-input']}
                      placeholder="Придумайте надёжный пароль"
                      required
                    />
                    <button
                      type="button"
                      className={styles['eye-button']}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Показать пароль"
                    >
                      <img
                        src={eyeIcon}
                        alt=""
                        className={styles['eye-icon']}
                      />
                    </button>
                  </div>
                  {passwordStrength && (
                    <div className={styles['hint-success']}>
                      {passwordStrength}
                    </div>
                  )}
                  {showHint && (
                    <div className={styles['hint-text']}>
                      Пароль должен содержать не менее 8 знаков
                    </div>
                  )}
                </div>
                {submitError && (
                  <div className={styles['error-message']}>{submitError}</div>
                )}
                <div className={styles.block2}>
                  <button type="submit" className={styles.button}>
                    Далее
                  </button>
                  <p className={styles.register}>
                    <Link to="/login" state={location.state}>
                      Уже есть аккаунт
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className={styles['image-column']}>
            <img src={lightBulbImage} alt="Лампочка" className={styles.image} />
            <div className={styles['text-block']}>
              <h2 className={styles['welcome-title']}>
                Добро пожаловать в SkillSwap!
              </h2>
              <p className={styles['welcome-text']}>
                Присоединяйтесь к сообществу и обменивайтесь знаниями и навыками
                с другими людьми
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { RegisterPage };
