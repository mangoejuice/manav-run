import React from 'react';
import Link from 'next/link';
import { formatDate } from '../../utils/formatDate';

import styles from './HomeFeed.module.scss';

interface FeedRowProps {
  date: string;
  title: string;
  href: string;
}

export function FeedRow({ date, title, href }: FeedRowProps) {
  return (
    <li className={styles.row}>
      <span className={styles.date}>{formatDate(date)}</span>
      <Link href={href} className={styles.title}>{title}</Link>
    </li>
  );
}
