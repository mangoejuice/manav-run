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

export function SideNav({
  shouldHide = false,
  inMenu = false,
  setIsMenuOpen = () => { },
}: {
  shouldHide?: boolean,
  inMenu?: boolean,
  setIsMenuOpen?: (isOpen: boolean) => void
}) {
  const router = useRouter();

  if (shouldHide) {
    return null;
  }

  const handleClick = () => {
    setTimeout(() => setIsMenuOpen?.(false), 375);
  }

  return (
    <nav className={`${styles.nav} ${inMenu ? styles.inMenu : ''}`}>
      {inMenu && (
        <div className={styles.homeSection}>
          <Link
            href="/"
            className={`${styles.homeLink} ${router.pathname === '/' ? styles.active : ''}`}
            onClick={handleClick}
          >
            Home
          </Link>
        </div>
      )}
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
                    <Link {...link} onClick={handleClick} />
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
