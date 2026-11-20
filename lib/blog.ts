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
//   description: One line for the post list and link previews
//   draft: true   # optional; drafts only show in `next dev`
//   ---
//
// Server-only: read by getServerSideProps and /api/posts, and bundled into
// those functions via outputFileTracingIncludes in next.config.js.
const POSTS_DIR = path.join(process.cwd(), 'content/blog');

export interface PostSummary {
  slug: string;
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

function readPost(file: string) {
  const slug = path.basename(file, '.md');
  const ast = Markdoc.parse(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
  // JSON_SCHEMA keeps `date: 2026-11-19` a string instead of a Date.
  const meta = (yaml.load(ast.attributes.frontmatter ?? '', { schema: yaml.JSON_SCHEMA }) ?? {}) as Frontmatter;
  if (!meta.title || !/^\d{4}-\d{2}-\d{2}$/.test(meta.date ?? '')) {
    throw new Error(`content/blog/${file}: frontmatter needs a title and a YYYY-MM-DD date`);
  }
  const summary: PostSummary = { slug, title: meta.title, date: meta.date, description: meta.description ?? null };
  return { summary, ast, draft: meta.draft === true };
}

// Parsed once per server instance in production; re-read on every request in
// dev so edits show up on refresh.
let cache: ReturnType<typeof readPost>[] | null = null;

function loadPosts() {
  if (cache) return cache;
  // Git doesn't keep empty folders, so no folder just means no posts yet.
  const posts = !fs.existsSync(POSTS_DIR) ? [] : fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map(readPost)
    .filter((post) => showDrafts || !post.draft)
    .sort((a, b) => b.summary.date.localeCompare(a.summary.date));
  if (!showDrafts) cache = posts;
  return posts;
}

// Newest first.
export function getPostSummaries(): PostSummary[] {
  return loadPosts().map((post) => post.summary);
}

export function getPost(slug: string): Post | null {
  const post = loadPosts().find((p) => p.summary.slug === slug);
  if (!post) return null;
  const errors = Markdoc.validate(post.ast, BLOG_CONFIG).filter((e) => e.error.level === 'critical');
  if (errors.length) {
    throw new Error(`content/blog/${slug}.md: ${errors.map((e) => e.error.message).join('; ')}`);
  }
  // Round-trip through JSON: getServerSideProps only serializes plain objects,
  // and Markdoc's Tag is a class.
  const content = JSON.parse(JSON.stringify(Markdoc.transform(post.ast, BLOG_CONFIG)));
  return { ...post.summary, content };
}
