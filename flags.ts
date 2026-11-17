import { evaluate, flag } from 'flags/next';
import { vercelAdapter } from '@flags-sdk/vercel';

// Managed in the Vercel dashboard (Flags → `photos`).
export const photosFlag = flag<boolean>({
  key: 'photos',
  description: 'Show the Photography page, tab, and home feed photo sets',
  adapter: vercelAdapter(),
  defaultValue: false,
});

export type FlagValues = { photos: boolean };

// A Pages Router request (getServerSideProps / API routes), as `evaluate` accepts it.
type FlagRequest = NonNullable<Parameters<typeof evaluate>[1]>;

export async function getFlagValues(req: FlagRequest): Promise<FlagValues> {
  // Local dev can't reach Vercel Flags without `vercel link` + `vercel env pull`,
  // so allow PHOTOS_FLAG_OVERRIDE=true|false in .env.local during development.
  const override = process.env.PHOTOS_FLAG_OVERRIDE;
  if (process.env.NODE_ENV === 'development' && override) {
    return { photos: override === 'true' };
  }
  return evaluate({ photos: photosFlag }, req);
}
