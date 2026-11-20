import fs from 'node:fs';
import path from 'node:path';
import Markdoc, { type RenderableTreeNode } from '@markdoc/markdoc';
import yaml from 'js-yaml';
import { BLOG_CONFIG } from '../markdoc/schema';

// Posts are Markdoc files in content/blog/<slug>.md, served at /blog/<slug>:
//
//   ---
//   title: Post title
//   date: 2026-11-19
//   description: One line for link previews
//   draft: true   # optional; drafts only show in `next dev`
//   ---
//
// Server-only: read by getServerSideProps and /api/posts, and bundled into
// those functions via outputFileTracingIncludes in next.config.js.
const POSTS_DIR = path.join(process.cwd(), 'content/blog');

export interface PostSummary {
  slug: string;
  href: string;
  title: string;
  date: string; // YYYY-MM-DD
  description: string | null;
}

export interface Post extends PostSummary {
  content: RenderableTreeNode;
}

interface Frontmatter {
  title?: string;
  date?: string;
  description?: string;
  draft?: boolean;
}

const showDrafts = process.env.NODE_ENV === 'development';

// Parse, validate and render a post up front, so a broken file fails the
// first load and requests only look posts up.
function readPost(file: string): { post: Post; draft: boolean } {
  const slug = path.basename(file, '.md');
  const fail = (reason: string) => new Error(`content/blog/${file}: ${reason}`);
  const ast = Markdoc.parse(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
  // JSON_SCHEMA keeps `date: 2026-11-19` a string instead of a Date.
  const meta = (yaml.load(ast.attributes.frontmatter ?? '', { schema: yaml.JSON_SCHEMA }) ?? {}) as Frontmatter;
  if (!meta.title || !/^\d{4}-\d{2}-\d{2}$/.test(meta.date ?? '')) {
    throw fail('frontmatter needs a title and a YYYY-MM-DD date');
  }
  const errors = Markdoc.validate(ast, BLOG_CONFIG).filter((e) => e.error.level === 'critical');
  if (errors.length) throw fail(errors.map((e) => e.error.message).join('; '));
  // Round-trip through JSON: getServerSideProps only serializes plain objects,
  // and Markdoc's Tag is a class (@markdoc/next.js does the same).
  const content = JSON.parse(JSON.stringify(Markdoc.transform(ast, BLOG_CONFIG)));
  return {
    post: { slug, href: `/blog/${slug}`, title: meta.title, date: meta.date, description: meta.description ?? null, content },
    draft: meta.draft === true,
  };
}

// Loaded once per server instance in production; re-read on every request in
// dev so edits show up on refresh.
let cache: Post[] | null = null;

function loadPosts(): Post[] {
  if (cache) return cache;
  // Git doesn't keep empty folders, so no folder just means no posts yet.
  const files = fs.existsSync(POSTS_DIR) ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md')) : [];
  const posts = files.map(readPost).filter(({ draft }) => showDrafts || !draft).map(({ post }) => post);
  if (!showDrafts) cache = posts;
  return posts;
}

// Unordered; callers group them with groupByYear.
export function getPostSummaries(): PostSummary[] {
  return loadPosts().map(({ content, ...summary }) => summary);
}

export function getPost(slug: string): Post | null {
  return loadPosts().find((post) => post.slug === slug) ?? null;
}
