import React from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import items from '../race_registry';
import raceStats from '../race_stats.json';
import { getFlagValues } from '../flags';
import { groupByYear } from '../utils/groupByYear';
import { FeedRow } from '../components/home/FeedRow';
import { RaceTimes, RaceTimesHeader } from '../components/running/RaceTimes';

import styles from '../components/home/HomeFeed.module.scss';
import runningStyles from './running.module.scss';

// 404 unless the `photos` flag is on.
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!(await getFlagValues(req)).photos) {
    return { notFound: true };
  }
  return { props: {} };
};

const YEARS = groupByYear(
  items.flatMap((year) =>
    year.links.map((race) => ({
      id: race.id,
      date: race.date,
      title: race.children,
      href: race.href,
      stats: raceStats[race.gpxfile],
    }))
  )
);

export default function Running() {
  return (
    <>
      <Head>
        <title>Running · manav.run</title>
      </Head>
      <h1>Running</h1>
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
