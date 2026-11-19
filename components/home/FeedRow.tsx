import React from 'react';
import Link from 'next/link';
import type { Photo } from '../../photo_registry';
import { formatDate } from '../../utils/formatDate';
import { PhotoTile } from '../photos/PhotoTile';

import styles from './HomeFeed.module.scss';

interface FeedRowProps {
  date: string;
  title: string;
  href: string;
  // Photo sets show up to three thumbnails: before the title on desktop, below it on mobile.
  photos?: Photo[];
  // Optional trailing column on desktop; drops below the title on mobile.
  children?: React.ReactNode;
}

export function FeedRow({ date, title, href, photos, children }: FeedRowProps) {
  return (
    <li className={`${styles.row} ${children ? styles.hasExtra : ''}`}>
      <span className={styles.date}>{formatDate(date)}</span>
      <div className={styles.content}>
        <Link href={href} className={styles.title}>{title}</Link>
        {photos && (
          <Link href={href} className={styles.thumbs} tabIndex={-1} aria-hidden="true">
            {photos.slice(0, 3).map((photo, i) => (
              <PhotoTile key={i} photo={photo} alt={i % 2 === 1} sizes="64px" className={styles.thumb} />
            ))}
          </Link>
        )}
      </div>
      {children && <div className={styles.extra}>{children}</div>}
    </li>
  );
}
