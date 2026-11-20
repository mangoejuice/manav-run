import React from 'react';
import { Heatmap, HeatmapLegend, type RaceDay } from './Heatmap';

import styles from './RunningHeatmap.module.scss';

interface RunningHeatmapProps {
  start: string; // YYYY-MM-DD
  today: string;
  runs: Record<string, number>; // miles per YYYY-MM-DD
  races: Record<string, RaceDay>; // per YYYY-MM-DD
}

// Heatmap of runs (synced from Strava into run_miles.json) and race days.
export function RunningHeatmap({ start, today, runs, races }: RunningHeatmapProps) {
  return (
    <section className={styles.container}>
      <Heatmap start={start} today={today} runs={runs} races={races} />
      <HeatmapLegend />
    </section>
  );
}
