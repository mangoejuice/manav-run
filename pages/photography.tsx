import React from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import photoSets from '../photo_registry';
import { getFlagValues } from '../flags';
import { PhotoWall } from '../components/photos/PhotoWall';

// 404 unless the `photos` flag is on.
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!(await getFlagValues(req)).photos) {
    return { notFound: true };
  }
  return { props: {} };
};

export default function Photography() {
  return (
    <>
      <Head>
        <title>Photography · manav.run</title>
      </Head>
      <PhotoWall sets={photoSets} />
    </>
  );
}
