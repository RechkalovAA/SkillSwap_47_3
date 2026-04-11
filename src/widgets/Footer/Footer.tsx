import styles from './Footer.module.css';
import logo from '../../assets/images/logo.svg';

interface FooterLink {
  label: string;
  href: string;
}

export function Footer() {
  const sections: FooterLink[][] = [
    [
      { label: 'О проекте', href: '/about' },
      { label: 'Все навыки', href: '/all-skills' },
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
        {/* Колонка 1 */}
        <div className={styles.columnFirst}>
          <div className={styles.logo}>
            <img src={logo} alt="SkillSwap Logo" />
            <h2 className={styles.h2}>SkillSwap</h2>
          </div>
          <div className={styles.copyright}>SkillSwap — 2025</div>
        </div>

        {/* Колонка 2 */}
        <div className={styles.column}>
          <div className={styles.linksWrapper}>
            <ul className={styles.linksListDot}>
              {sections[0].map((link) => (
                <li key={link.label} className={styles.linkItemDot}>
                  <a href={link.href} className={styles.link}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Колонка 3 */}
        <div className={styles.column}>
          <div className={styles.linksWrapper}>
            <ul className={styles.linksList}>
              {sections[1].map((link) => (
                <li key={link.label} className={styles.linkItem}>
                  <a href={link.href} className={styles.link}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Колонка 4 */}
        <div className={styles.column}>
          <div className={styles.linksWrapper}>
            <ul className={styles.linksList}>
              {sections[2].map((link) => (
                <li key={link.label} className={styles.linkItem}>
                  <a href={link.href} className={styles.link}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
