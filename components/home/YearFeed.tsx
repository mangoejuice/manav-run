import React from 'react';
import { groupByYear } from '../../utils/groupByYear';

import styles from './HomeFeed.module.scss';

interface YearFeedProps<T extends { date: string }> {
  entries: T[];
  renderRow: (entry: T) => React.ReactNode; // a FeedRow, keyed
  headerExtra?: React.ReactNode; // shown beside each year heading,
  headerClassName?: string; // in a row with this class
}

// Entries grouped under year headings, newest first (home, running, blog).
export function YearFeed<T extends { date: string }>({ entries, renderRow, headerExtra, headerClassName }: YearFeedProps<T>) {
  return (
    <div className={styles.feed}>
      {groupByYear(entries).map(([year, rows]) => (
        <section key={year} className={styles.year}>
          {headerExtra ? (
            <div className={headerClassName}>
              <h2 className={styles.yearHeading}>{year}</h2>
              {headerExtra}
            </div>
          ) : (
            <h2 className={styles.yearHeading}>{year}</h2>
          )}
          <ul className={styles.rows}>{rows.map(renderRow)}</ul>
        </section>
      ))}
    </div>
  );
}
