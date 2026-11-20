import React from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import items from '../race_registry';
import raceStats from '../race_stats.json';
import runMiles from '../run_miles.json';
import { getFlagValues } from '../flags';
import { groupByYear } from '../utils/groupByYear';
import { HEATMAP_START } from '../utils/heatmapStart';
import { FeedRow } from '../components/home/FeedRow';
import { RaceTimes, RaceTimesHeader } from '../components/running/RaceTimes';
import { RunningHeatmap } from '../components/running/RunningHeatmap';

import styles from '../components/home/HomeFeed.module.scss';
import runningStyles from './running.module.scss';

interface RunningProps {
  today: string; // YYYY-MM-DD in New York, so the heatmap blanks future days
}

// 404 unless the `photos` flag is on.
export const getServerSideProps: GetServerSideProps<RunningProps> = async ({ req }) => {
  if (!(await getFlagValues(req)).photos) {
    return { notFound: true };
  }
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  return { props: { today } };
};

const raceList = items.flatMap((year) => year.links);
const RACE_DAYS = Object.fromEntries(
  raceList.map((race) => [
    race.date,
    { name: race.children, href: race.href, miles: raceStats[race.gpxfile]?.distanceMi },
  ])
);

const YEARS = groupByYear(
  raceList.map((race) => ({
    id: race.id,
    date: race.date,
    title: race.children,
    href: race.href,
    stats: raceStats[race.gpxfile],
  }))
);

export default function Running({ today }: RunningProps) {
  return (
    <>
      <Head>
        <title>Running · manav.run</title>
      </Head>
      <h1>Running</h1>
      <RunningHeatmap start={HEATMAP_START} today={today} runs={runMiles} races={RACE_DAYS} />
      <div className={styles.feed}>
        {YEARS.map(([year, races]) => (
          <section key={year} className={styles.year}>
            <div className={runningStyles.yearHeader}>
              <h2 className={styles.yearHeading}>{year}</h2>
              <RaceTimesHeader />
            </div>
            <ul className={styles.rows}>
              {races.map(({ id, stats, ...race }) => (
                <FeedRow key={id} {...race}>
                  {stats && <RaceTimes {...stats} />}
                </FeedRow>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
