import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './TopNav.module.scss';

export function TopNav({ children }) {
  const router = useRouter();
  const active = router.pathname === '/';

  return (
    <nav className={styles.nav}>
      <Link href="/" className={`${styles.homeButton} ${active ? "active" : ""}`}>
        Home
      </Link>
      <section className={styles.section}>{children}</section>
      <div className={styles.icons}>
        <Link href="https://github.com/mgoel283" target="_blank" rel="noreferrer noopener" className={styles.icon}>
          <i className="fi fi-brands-github" />
        </Link>
        <Link href="https://www.linkedin.com/in/manav-goel/" target="_blank" rel="noreferrer noopener" className={styles.icon}>
          <i className="fi fi-brands-linkedin" />
        </Link>
      </div>
    </nav>
  );
}
