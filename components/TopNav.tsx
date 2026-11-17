import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { usePhotosFlag } from '../utils/usePhotosFlag';

import styles from './TopNav.module.scss';

// Shown when the `photos` flag is on.
const TABS = [
  { href: '/', label: 'Home' },
  { href: '/photography', label: 'Photography' },
];

interface TopNavProps {
  children: React.ReactNode;
  isMobile: boolean;
}

export function TopNav({ children, isMobile }: TopNavProps) {
  const router = useRouter();
  const active = router.pathname === '/';
  const photosEnabled = usePhotosFlag();

  return (
    <nav className={styles.nav}>
      <div className={styles.leftItems}>
        {photosEnabled ? (
          <div className={styles.tabs}>
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`${styles.tab} ${router.pathname === tab.href ? styles.activeTab : ''}`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        ) : isMobile ? (
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
  );
}
