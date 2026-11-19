import React from 'react';
import { formatDuration } from '../../utils/formatDuration';

import styles from './RaceTimes.module.scss';

// Moving time and pace from the race's GPX file (see scripts/race-stats.mjs).
export function RaceTimes({ movingMs, paceMs }: { movingMs: number; paceMs: number }) {
  return (
    <div className={styles.times}>
      <span className={styles.time}>{formatDuration(movingMs)}</span>
      <span className={styles.pace}>
        {formatDuration(paceMs)}
        <span className={styles.unit}> /mi</span>
      </span>
    </div>
  );
}

// Column labels for the year heading; shares widths with RaceTimes so they line up.
export function RaceTimesHeader() {
  return (
    <div className={`${styles.times} ${styles.header}`}>
      <span className={styles.time}>Time</span>
      <span className={styles.pace}>Pace</span>
    </div>
  );
}
