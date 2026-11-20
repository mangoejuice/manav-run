import React, { useEffect, useMemo, useState } from 'react';
import { allRaces } from '../../race_registry';
import photoSets, { type Photo } from '../../photo_registry';
import type { PostSummary } from '../../lib/blog';
import { useFlags } from '../../utils/useFlags';
import { groupByYear } from '../../utils/groupByYear';
import { FeedRow } from './FeedRow';

import styles from './HomeFeed.module.scss';

interface FeedEntry {
  id: string;
  date: string;
  title: string;
  href: string;
  photos?: Photo[];
  label?: 'Race' | 'Post'; // shown at the end of the row
}

const raceEntries: FeedEntry[] = allRaces.map((race) => ({
  id: race.id,
  date: race.date,
  title: race.children,
  href: race.href,
  label: 'Race',
}));

const photoEntries: FeedEntry[] = photoSets.map((set) => ({
  id: set.id,
  date: set.date,
  title: set.title,
  href: '/photography',
  photos: set.photos,
}));

// Blog posts live on the server (content/blog), so the feed fetches them once
// the `blog` flag reads on.
function usePostEntries(enabled: boolean): FeedEntry[] {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    fetch('/api/posts')
      .then((res) => (res.ok ? res.json() : []))
      .then((list: PostSummary[]) => active && setPosts(list))
      .catch(() => {});
    return () => { active = false; };
  }, [enabled]);
  return useMemo(
    () => posts.map((post) => ({ id: `post-${post.slug}`, date: post.date, title: post.title, href: `/blog/${post.slug}`, label: 'Post' as const })),
    [posts]
  );
}

// Every race, plus photo sets when the `photos` flag is on and blog posts when
// the `blog` flag is on.
export function HomeFeed() {
  const flags = useFlags();
  const postEntries = usePostEntries(flags.blog);
  const years = useMemo(
    () => groupByYear([...raceEntries, ...(flags.photos ? photoEntries : []), ...(flags.blog ? postEntries : [])]),
    [flags.photos, flags.blog, postEntries]
  );

  return (
    <div className={styles.feed}>
      {years.map(([year, entries]) => (
        <section key={year} className={styles.year}>
          <h2 className={styles.yearHeading}>{year}</h2>
          <ul className={styles.rows}>
            {entries.map(({ id, label, ...entry }) => (
              <FeedRow key={id} {...entry}>
                {label && <span className={styles.kind}>{label}</span>}
              </FeedRow>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
