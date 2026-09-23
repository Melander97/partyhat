'use client';

import { useEffect, useState } from 'react';
import { loadClientId, saveClientId } from '@/lib/game/client-id';

/**
 * An anonymous, per-browser identity for the leaderboard — not a real
 * account, just a stable id so "your best run" and future rate limiting
 * have something to key off. Generated once on first visit and persisted;
 * every later visit reuses the same value.
 *
 * Returns:
 *  - `clientId`: the id, or null before it's been loaded/generated
 *  - `mounted`: true once loading (or first-time generation) has finished
 */
export function useClientId() {
  const [clientId, setClientId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const existing = loadClientId();
    if (existing) {
      setClientId(existing);
    } else {
      const fresh = window.crypto.randomUUID();
      saveClientId(fresh);
      setClientId(fresh);
    }
    setMounted(true);
  }, []);

  return { clientId, mounted };
}
