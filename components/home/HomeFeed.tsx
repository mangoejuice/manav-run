import React from 'react';
import items from '../../race_registry';
import photoSets, { type Photo } from '../../photo_registry';
import { usePhotosFlag } from '../../utils/usePhotosFlag';
import { FeedRow } from './FeedRow';

import styles from './HomeFeed.module.scss';

interface FeedEntry {
  id: string;
  date: string;
  title: string;
  href: string;
  photos?: Photo[];
}

const raceEntries: FeedEntry[] = items.flatMap((year) =>
  year.links.map((race) => ({ id: race.id, date: race.date, title: race.children, href: race.href }))
);

const photoEntries: FeedEntry[] = photoSets.map((set) => ({
  id: set.id,
  date: set.date,
  title: set.title,
  href: '/photography',
  photos: set.photos,
}));

// Newest first, grouped by year.
function groupByYear(entries: FeedEntry[]): [string, FeedEntry[]][] {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const years = new Map<string, FeedEntry[]>();
  for (const entry of sorted) {
    const year = entry.date.slice(0, 4);
    if (!years.has(year)) years.set(year, []);
    years.get(year).push(entry);
  }
  return [...years];
}

// Both variants are static, so build them once.
const RACES_ONLY = groupByYear(raceEntries);
const WITH_PHOTOS = groupByYear([...raceEntries, ...photoEntries]);

// Every race, plus photo sets when the `photos` flag is on.
export function HomeFeed() {
  const years = usePhotosFlag() ? WITH_PHOTOS : RACES_ONLY;

  return (
    <div className={styles.feed}>
      {years.map(([year, entries]) => (
        <section key={year} className={styles.year}>
          <h2 className={styles.yearHeading}>{year}</h2>
          <ul className={styles.rows}>
            {entries.map((entry) => (
              <FeedRow key={entry.id} {...entry} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
