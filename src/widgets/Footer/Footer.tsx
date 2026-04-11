import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import logo from '../../assets/images/logo.svg';

interface FooterLink {
  label: string;
  href: string;
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  const sections: FooterLink[][] = [
    [
      { label: 'О проекте', href: '/about' },
      { label: 'Все навыки', href: '/catalog' },
    ],
    [
      { label: 'Контакты', href: '/contacts' },
      { label: 'Блог', href: '/blog' },
    ],
    [
      { label: 'Политика конфиденциальности', href: '/privacy' },
      { label: 'Пользовательское соглашение', href: '/terms' },
    ],
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Колонка 1 - Логотип */}
        <div className={styles['column-first']}>
          <div className={styles.logo}>
            <Link to="/" className={styles['logo-link']}>
              <img
                src={logo}
                alt="SkillSwap Logo"
                className={styles['logo-icon']}
              />
              <h2 className={styles.h2}>SkillSwap</h2>
            </Link>
          </div>
          <div className={styles.copyright}>
            © {currentYear} SkillSwap — {currentYear}
          </div>
        </div>

        {/* Колонка 2 */}
        <div className={styles.column}>
          <div className={styles['links-wrapper']}>
            <ul
              className={`${styles['links-list']} ${styles['links-list-with-disc']}`}
            >
              {sections[0].map((link) => (
                <li key={link.label} className={styles['link-item']}>
                  <Link to={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Колонка 3 */}
        <div className={styles.column}>
          <div className={styles['links-wrapper']}>
            <ul className={styles['links-list']}>
              {sections[1].map((link) => (
                <li key={link.label} className={styles['link-item']}>
                  <Link to={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Колонка 4 */}
        <div className={styles.column}>
          <div className={styles['links-wrapper']}>
            <ul className={styles['links-list']}>
              {sections[2].map((link) => (
                <li key={link.label} className={styles['link-item']}>
                  <Link to={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
