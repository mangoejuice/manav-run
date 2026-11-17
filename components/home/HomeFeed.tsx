import React from 'react';
import items from '../../race_registry';
import { FeedRow } from './FeedRow';

import styles from './HomeFeed.module.scss';

// Every race, grouped by year. race_registry is kept newest-first.
export function HomeFeed() {
  return (
    <div className={styles.feed}>
      {items.map((year) => (
        <section key={year.title} className={styles.year}>
          <h2 className={styles.yearHeading}>{year.title}</h2>
          <ul className={styles.rows}>
            {year.links.map((race) => (
              <FeedRow
                key={race.id}
                date={race.date}
                title={race.children}
                href={race.href}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
