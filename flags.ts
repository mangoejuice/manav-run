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

// Adding a flag: define it above and list it here.
const FLAGS = { photos: photosFlag, blog: blogFlag };

export type FlagValues = Record<keyof typeof FLAGS, boolean>;

// A Pages Router request (getServerSideProps / API routes), as `evaluate` accepts it.
type FlagRequest = NonNullable<Parameters<typeof evaluate>[1]>;

export async function getFlagValues(req: FlagRequest): Promise<FlagValues> {
  // Local dev can't reach Vercel Flags without `vercel link` + `vercel env pull`,
  // so allow <NAME>_FLAG_OVERRIDE=true|false (e.g. BLOG_FLAG_OVERRIDE) in
  // .env.local. When any is set, flags without one read their default.
  if (process.env.NODE_ENV === 'development') {
    const overrides = Object.keys(FLAGS).map((key) => [key, process.env[`${key.toUpperCase()}_FLAG_OVERRIDE`]]);
    if (overrides.some(([, value]) => value)) {
      return Object.fromEntries(
        overrides.map(([key, value]) => [key, value ? value === 'true' : FLAGS[key].defaultValue])
      ) as FlagValues;
    }
  }
  return evaluate(FLAGS, req);
}
