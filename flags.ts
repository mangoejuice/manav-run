import { evaluate, flag } from 'flags/next';
import { vercelAdapter } from '@flags-sdk/vercel';

// Managed in the Vercel dashboard (Flags → `photos`, `blog`).
export const photosFlag = flag<boolean>({
  key: 'photos',
  description: 'Show the Running and Photography pages and tabs, and home feed photo sets',
  adapter: vercelAdapter(),
  defaultValue: false,
});

export const blogFlag = flag<boolean>({
  key: 'blog',
  description: 'Show the Blog page and tab, and posts in the home feed',
  adapter: vercelAdapter(),
  defaultValue: false,
});

export type FlagValues = { photos: boolean; blog: boolean };

// A Pages Router request (getServerSideProps / API routes), as `evaluate` accepts it.
type FlagRequest = NonNullable<Parameters<typeof evaluate>[1]>;

export async function getFlagValues(req: FlagRequest): Promise<FlagValues> {
  // Local dev can't reach Vercel Flags without `vercel link` + `vercel env pull`,
  // so allow PHOTOS_FLAG_OVERRIDE / BLOG_FLAG_OVERRIDE=true|false in .env.local
  // (when either is set, an unset one reads false).
  const { PHOTOS_FLAG_OVERRIDE: photos, BLOG_FLAG_OVERRIDE: blog } = process.env;
  if (process.env.NODE_ENV === 'development' && (photos || blog)) {
    return { photos: photos === 'true', blog: blog === 'true' };
  }
  return evaluate({ photos: photosFlag, blog: blogFlag }, req);
}
