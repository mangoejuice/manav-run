import React from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { allRaces } from '../race_registry';
import raceStats from '../race_stats.json';
import runMiles from '../run_miles.json';
import { getFlagValues } from '../flags';
import { HEATMAP_START } from '../utils/heatmapStart';
import { FeedRow } from '../components/home/FeedRow';
import { RaceTimes, RaceTimesHeader } from '../components/running/RaceTimes';
import { Heatmap } from '../components/running/Heatmap';
import { YearFeed } from '../components/home/YearFeed';

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

const RACE_DAYS = Object.fromEntries(
  allRaces.map((race) => [
    race.date,
    { name: race.children, href: race.href, miles: raceStats[race.gpxfile]?.distanceMi },
  ])
);

const RACES = allRaces.map((race) => ({
  id: race.id,
  date: race.date,
  title: race.children,
  href: race.href,
  stats: raceStats[race.gpxfile],
}));

export default function Running({ today }: RunningProps) {
  return (
    <>
      <Head>
        <title>Running · manav.run</title>
      </Head>
      <Heatmap start={HEATMAP_START} today={today} runs={runMiles} races={RACE_DAYS} />
      <YearFeed
        entries={RACES}
        headerExtra={<RaceTimesHeader />}
        headerClassName={runningStyles.yearHeader}
        renderRow={({ id, stats, ...race }) => (
          <FeedRow key={id} {...race}>
            {stats && <RaceTimes {...stats} />}
          </FeedRow>
        )}
      />
    </>
  );
}
