import React from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { getFlagValues } from '../../flags';
import { getPostSummaries, type PostSummary } from '../../lib/blog';
import { groupByYear } from '../../utils/groupByYear';
import { FeedRow } from '../../components/home/FeedRow';

import styles from '../../components/home/HomeFeed.module.scss';

interface BlogProps {
  posts: PostSummary[];
}

// 404 unless the `blog` flag is on.
export const getServerSideProps: GetServerSideProps<BlogProps> = async ({ req }) => {
  if (!(await getFlagValues(req)).blog) {
    return { notFound: true };
  }
  return { props: { posts: getPostSummaries() } };
};

export default function Blog({ posts }: BlogProps) {
  return (
    <>
      <Head>
        <title>Blog · manav.run</title>
      </Head>
      <div className={styles.feed}>
        {posts.length === 0 && <p>No posts yet.</p>}
        {groupByYear(posts.map((post) => ({ ...post, href: `/blog/${post.slug}` }))).map(([year, entries]) => (
          <section key={year} className={styles.year}>
            <h2 className={styles.yearHeading}>{year}</h2>
            <ul className={styles.rows}>
              {entries.map((post) => (
                <FeedRow key={post.slug} date={post.date} title={post.title} href={post.href} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
