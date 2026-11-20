import React from 'react';
import Head from 'next/head';
import Markdoc from '@markdoc/markdoc';
import type { GetServerSideProps } from 'next';
import { getFlagValues } from '../../flags';
import { getPost, type Post } from '../../lib/blog';
import { BLOG_COMPONENTS } from '../../markdoc/schema';
import { formatLongDate } from '../../utils/formatDate';

import styles from './post.module.scss';

interface PostProps {
  post: Post;
}

// 404 unless the `blog` flag is on and the post exists (drafts only in dev).
export const getServerSideProps: GetServerSideProps<PostProps> = async ({ req, params }) => {
  const post = (await getFlagValues(req)).blog && getPost(String(params.slug));
  if (!post) {
    return { notFound: true };
  }
  return { props: { post } };
};

export default function BlogPost({ post }: PostProps) {
  return (
    <div className={styles.post}>
      <Head>
        <title>{`${post.title} · manav.run`}</title>
        {post.description && <meta name="description" content={post.description} />}
      </Head>
      <header className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        <time dateTime={post.date} className={styles.date}>{formatLongDate(post.date)}</time>
      </header>
      {Markdoc.renderers.react(post.content, React, { components: BLOG_COMPONENTS })}
    </div>
  );
}
