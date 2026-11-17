import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import items from '../race_registry';
import { formatDate } from '../utils/formatDate';

import styles from './SideNav.module.scss';

export function SideNav({ shouldHide = false }: { shouldHide?: boolean }) {
  const router = useRouter();

  if (shouldHide) {
    return null;
  }

  return (
    <nav className={styles.nav}>
      {items.map((item) => (
        <div key={item.title}>
          <span className={styles.span}>{item.title}</span>
          <ul className={styles.ul}>
            {item.links.map((link) => {
              const active = router.pathname === link.href;
              return (
                <li key={link.href} className={`${styles.li} ${active ? styles.active : ''}`}>
                  <div className={styles.raceitem}>
                    <span className={styles.racedate}>{formatDate(link.date)}</span>
                    <Link {...link} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
