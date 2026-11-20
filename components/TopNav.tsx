import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import type { FlagValues } from '../flags';
import { useFlags } from '../utils/useFlags';

import styles from './TopNav.module.scss';

// Each tab shows when its flag is on (Home whenever any other tab does).
const TABS: { href: string; label: string; flag?: keyof FlagValues }[] = [
  { href: '/', label: 'Home' },
  { href: '/running', label: 'Running', flag: 'photos' },
  { href: '/photography', label: 'Photography', flag: 'photos' },
  { href: '/blog', label: 'Blog', flag: 'blog' },
];

// The Blog tab stays active on post pages.
function isActive(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
}

interface TopNavProps {
  children: React.ReactNode;
  isMobile: boolean;
}

export function TopNav({ children, isMobile }: TopNavProps) {
  const router = useRouter();
  const active = router.pathname === '/';
  const flags = useFlags();
  const tabs = TABS.filter((tab) => !tab.flag || flags[tab.flag]);

  return (
    <nav className={styles.nav}>
      <div className={styles.leftItems}>
        {tabs.length > 1 ? (
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`${styles.tab} ${isActive(router.pathname, tab.href) ? styles.activeTab : ''}`}
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
