import React from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { getFlagValues } from '../../flags';
import { getPostSummaries, type PostSummary } from '../../lib/blog';
import { FeedRow } from '../../components/home/FeedRow';
import { YearFeed } from '../../components/home/YearFeed';

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
      {posts.length === 0 && <p>No posts yet.</p>}
      <YearFeed entries={posts} renderRow={(post) => <FeedRow key={post.slug} {...post} />} />
    </>
  );
}
