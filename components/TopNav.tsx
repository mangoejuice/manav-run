import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './TopNav.module.scss';

interface TopNavProps {
  children: React.ReactNode;
  isMobile: boolean;
}

export function TopNav({ children, isMobile }: TopNavProps) {
  const router = useRouter();
  const active = router.pathname === '/';

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.leftItems}>
          {isMobile ? (
            <Link href="/" className={styles.wordmark}>
              manav.run
            </Link>
          ) : (
            <Link href="/" className={`${styles.homeButton} ${active ? styles.active : ""}`}>
              Home
            </Link>
          )}
        </div>
        <section className={styles.section}>{children}</section>
        <div className={styles.icons}>
          <Link href="https://github.com/mangoejuice" target="_blank" rel="noreferrer noopener" className={styles.icon}>
            <i className="fi fi-brands-github" />
          </Link>
          <Link href="https://www.linkedin.com/in/manav-goel/" target="_blank" rel="noreferrer noopener" className={styles.icon}>
            <i className="fi fi-brands-linkedin" />
          </Link>
        </div>
      </nav>
    </>
  );
}
