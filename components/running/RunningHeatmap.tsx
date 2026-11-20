import React, { useMemo } from 'react';
import { Heatmap, HeatmapLegend, type RaceDay } from './Heatmap';
import { sampleRuns } from '../../utils/sampleRuns';

import styles from './RunningHeatmap.module.scss';

interface RunningHeatmapProps {
  start: string; // YYYY-MM-DD
  today: string;
  races: Record<string, RaceDay>; // per YYYY-MM-DD
}

// Heatmap and legend. Uses sample data for now.
export function RunningHeatmap({ start, today, races }: RunningHeatmapProps) {
  const runs = useMemo(() => sampleRuns(start, today), [start, today]);

  return (
    <section className={styles.container}>
      <Heatmap start={start} today={today} runs={runs} races={races} />
      <HeatmapLegend />
    </section>
  );
}
