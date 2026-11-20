import type { NextApiRequest, NextApiResponse } from 'next';
import { getFlagValues } from '../../flags';
import { getPostSummaries, type PostSummary } from '../../lib/blog';

// Post list for the home feed, which is statically rendered and can't read the
// filesystem itself. 404 unless the `blog` flag is on.
export default async function handler(req: NextApiRequest, res: NextApiResponse<PostSummary[]>) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (!(await getFlagValues(req)).blog) {
    res.status(404).end();
    return;
  }
  res.status(200).json(getPostSummaries());
}
