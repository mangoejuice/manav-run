import type { NextApiRequest, NextApiResponse } from 'next';
import { getFlagValues, type FlagValues } from '../../flags';

export default async function handler(req: NextApiRequest, res: NextApiResponse<FlagValues>) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.status(200).json(await getFlagValues(req));
}
