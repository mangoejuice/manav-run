import React from 'react';
import items from '../../race_registry';
import { FeedRow } from './FeedRow';

import styles from './HomeFeed.module.scss';

// Every race, grouped by year, newest first.
export function HomeFeed() {
  const years = [...items].sort((a, b) => b.title.localeCompare(a.title));

  return (
    <div className={styles.feed}>
      {years.map((year) => (
        <section key={year.title} className={styles.year}>
          <h2 className={styles.yearHeading}>{year.title}</h2>
          <ul className={styles.rows}>
            {[...year.links]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((race) => (
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
