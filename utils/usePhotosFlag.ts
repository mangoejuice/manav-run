import { useEffect, useState } from 'react';
import type { FlagValues } from '../flags';

// Fetched once per page load and shared by every caller.
let request: Promise<FlagValues> | null = null;

function fetchFlags(): Promise<FlagValues> {
  request ??= fetch('/api/flags')
    .then((res) => (res.ok ? res.json() : { photos: false }))
    .catch(() => ({ photos: false }));
  return request;
}

// Client-side read of the `photos` flag for statically rendered UI.
// Returns false until the value arrives.
export function usePhotosFlag(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    let active = true;
    fetchFlags().then((flags) => active && setEnabled(flags.photos));
    return () => { active = false; };
  }, []);
  return enabled;
}
