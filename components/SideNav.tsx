import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import items from '../race_registry';

import styles from './SideNav.module.scss';

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthStr = monthNames[month - 1];
  return `${monthStr} ${day}`;
}

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
