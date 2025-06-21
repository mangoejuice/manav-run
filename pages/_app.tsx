import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/next';

import { SideNav, TopNav, BlogSidebar } from '../components';

import 'prismjs';
// Import other Prism themes here
import 'prismjs/components/prism-bash.min';
import 'prismjs/themes/prism.css';

import '../public/globals.css'
import styles from './_app.module.scss';

import type { AppProps } from 'next/app'
import type { MarkdocNextJsPageProps } from '@markdoc/next.js'

const TITLE = 'Markdoc';
const DESCRIPTION = 'A powerful, flexible, Markdown-based authoring framework';

function collectHeadings(node, sections = []) {
  if (node) {
    if (node.name === 'Heading') {
      const title = node.children[0];

      if (typeof title === 'string') {
        sections.push({
          ...node.attributes,
          title
        });
      }
    }

    if (node.children) {
      for (const child of node.children) {
        collectHeadings(child, sections);
      }
    }
  }

  return sections;
}

function getRaceID(filePath) {
  return filePath.split("/").filter(Boolean)[0]
}

export type MyAppProps = MarkdocNextJsPageProps

export default function MyApp({ Component, pageProps }: AppProps<MyAppProps>) {
  const { markdoc } = pageProps;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1025);
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  let title = TITLE;
  let description = DESCRIPTION;
  let raceID = null;
  if (markdoc) {
    if (markdoc.frontmatter.title) {
      title = markdoc.frontmatter.title;
    }
    if (markdoc.frontmatter.description) {
      description = markdoc.frontmatter.description;
    }
    if (markdoc.file.path !== '/index.md') {
      raceID = getRaceID(markdoc.file.path)
    }
  }

  // // Removed SideNav for now
  // const toc = pageProps.markdoc?.content
  //   ? collectHeadings(pageProps.markdoc.content)
  //   : [];

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="referrer" content="strict-origin" />
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/2.6.0/uicons-brands/css/uicons-brands.css'></link>
        <link rel="icon" href="/icons/black-cat.png" />
      </Head>
      <Analytics />
      <TopNav isMobile={isMobile}>
        <></>
      </TopNav>
      <div className={styles.page}>
        <SideNav isMobile={isMobile} />
        <main className={styles.mainContent}>
          <Component {...pageProps} />
        </main>
        {(raceID && !isMobile) ? <BlogSidebar raceID={raceID} /> : null}
      </div>
    </>
  );
}
