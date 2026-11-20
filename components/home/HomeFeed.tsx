import React, { useEffect, useState } from 'react';
import { allRaces } from '../../race_registry';
import photoSets, { type Photo } from '../../photo_registry';
import type { PostSummary } from '../../lib/blog';
import { useFlags } from '../../utils/useFlags';
import { FeedRow } from './FeedRow';
import { YearFeed } from './YearFeed';

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

// Blog posts live on the server (content/blog). Fetched once per page load,
// alongside the flags rather than after them; /api/posts 404s when the
// `blog` flag is off, which leaves the list empty.
let postsRequest: Promise<FeedEntry[]> | null = null;

function fetchPostEntries(): Promise<FeedEntry[]> {
  postsRequest ??= fetch('/api/posts')
    .then((res) => (res.ok ? res.json() : []))
    .then((posts: PostSummary[]) =>
      posts.map(({ slug, date, title, href }) => ({ id: `post-${slug}`, date, title, href, label: 'Post' as const }))
    )
    .catch(() => []);
  return postsRequest;
}

function usePostEntries(): FeedEntry[] {
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  useEffect(() => {
    let active = true;
    fetchPostEntries().then((list) => active && setEntries(list));
    return () => { active = false; };
  }, []);
  return entries;
}

// Every race, plus photo sets when the `photos` flag is on and blog posts when
// the `blog` flag is on.
export function HomeFeed() {
  const flags = useFlags();
  const postEntries = usePostEntries();
  const entries = [...raceEntries, ...(flags.photos ? photoEntries : []), ...(flags.blog ? postEntries : [])];

  return (
    <YearFeed
      entries={entries}
      renderRow={({ id, label, ...entry }) => (
        <FeedRow key={id} {...entry}>
          {label && <span className={styles.kind}>{label}</span>}
        </FeedRow>
      )}
    />
  );
}
