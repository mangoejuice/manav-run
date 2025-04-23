import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import items from '../race_registry';

import styles from './SideNav.module.scss';

export function SideNav() {
  const router = useRouter();

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
                  <Link {...link} />
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
