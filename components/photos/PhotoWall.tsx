import React from 'react';
import type { PhotoSet } from '../../photo_registry';
import { formatDate, formatLongDate } from '../../utils/formatDate';
import { PhotoTile } from './PhotoTile';

import styles from './PhotoWall.module.scss';

// Masonry wall: 4 columns on desktop, 2 on mobile. Each photo shows its set's
// title and date on hover (desktop); the first photo of a set also gets a
// caption underneath on mobile.
export function PhotoWall({ sets }: { sets: PhotoSet[] }) {
  const tiles = sets.flatMap((set) =>
    set.photos.map((photo, i) => ({ set, photo, isFirst: i === 0, key: `${set.id}-${i}` }))
  );

  return (
    <div className={styles.wall}>
      {tiles.map(({ set, photo, isFirst, key }, n) => (
        <figure key={key} className={styles.item}>
          <div className={styles.frame}>
            <PhotoTile photo={photo} alt={n % 2 === 1} sizes="(max-width: 767px) 50vw, 25vw" />
            <div className={styles.overlay} aria-hidden="true">
              <span className={styles.overlayTitle}>{set.title}</span>
              <span className={styles.overlayDate}>{formatLongDate(set.date)}</span>
            </div>
          </div>
          {isFirst && (
            <figcaption className={styles.caption}>
              {set.title} · {formatDate(set.date)}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
