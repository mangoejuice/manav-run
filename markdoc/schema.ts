import type { Config } from '@markdoc/markdoc';
import { getSchema } from '@markdoc/next.js/runtime';
import { callout } from './tags/callout.markdoc';
import { docimage } from './tags/docimage.markdoc';
import { footnote } from './tags/footnote.markdoc';
import * as nodes from './nodes';
import * as functions from './functions';

// Blog posts are rendered outside pages/, so they use the same schema
// conversion @markdoc/next.js applies to .md pages: string render names
// (serializable through getServerSideProps) plus a name → component map.
// Only the tags posts use, so the home page's `feed` (and its registries)
// stays out of the post bundle.
const { components, ...config } = getSchema({ tags: { callout, docimage, footnote }, nodes, functions });

export const BLOG_CONFIG: Config = config;
export const BLOG_COMPONENTS: Record<string, React.ComponentType<any>> = components;
