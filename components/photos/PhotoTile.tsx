import React from 'react';
import Image from 'next/image';
import type { Photo } from '../../photo_registry';

import styles from './PhotoTile.module.scss';

interface PhotoTileProps {
  photo: Photo;
  // Use the darker placeholder shade (alternated by callers).
  alt?: boolean;
  sizes: string;
  className?: string;
}

// One photo, or a gray placeholder box at the photo's aspect ratio.
export function PhotoTile({ photo, alt = false, sizes, className = '' }: PhotoTileProps) {
  return (
    <div
      className={`${styles.tile} ${alt ? styles.alt : ''} ${className}`}
      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
    >
      {photo.src && (
        <Image src={photo.src} alt={photo.alt ?? ''} fill sizes={sizes} className={styles.image} />
      )}
    </div>
  );
}
