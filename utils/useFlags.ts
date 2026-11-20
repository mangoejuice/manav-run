import { useEffect, useState } from 'react';
import type { FlagValues } from '../flags';

const FLAGS_OFF: FlagValues = { photos: false, blog: false };

// Fetched once per page load and shared by every caller.
let request: Promise<FlagValues> | null = null;

function fetchFlags(): Promise<FlagValues> {
  request ??= fetch('/api/flags')
    .then((res) => (res.ok ? res.json() : FLAGS_OFF))
    .catch(() => FLAGS_OFF);
  return request;
}

// Client-side read of the feature flags for statically rendered UI.
// Every flag reads false until the values arrive.
export function useFlags(): FlagValues {
  const [flags, setFlags] = useState(FLAGS_OFF);
  useEffect(() => {
    let active = true;
    fetchFlags().then((values) => active && setFlags(values));
    return () => { active = false; };
  }, []);
  return flags;
}
