import { NextResponse } from 'next/server';
import { getTopEntries } from '@/lib/leaderboard/db';
import type { LeaderboardResponse } from '@/lib/leaderboard/api-types';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

/** Anything missing, non-numeric, or below 1 falls back to the default; anything above the max is clamped. */
function parseLimit(raw: string | null): number {
  if (raw === null) return DEFAULT_LIMIT;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(parsed, MAX_LIMIT);
}

/**
 * Public, read-only leaderboard. Ranks by streak (descending), then by how
 * fast the run was (ascending). No auth and no writes — submitting a run
 * is a separate route that requires a signed receipt.
 */
export async function GET(request: Request) {
  const limit = parseLimit(new URL(request.url).searchParams.get('limit'));
  const rows = await getTopEntries(limit);

  return NextResponse.json<LeaderboardResponse>({
    entries: rows.map((row, index) => ({
      rank: index + 1,
      handle: row.handle,
      streak: row.streak,
      durationMs: row.durationMs,
      createdAt: row.createdAt.toISOString(),
    })),
  });
}

export const dynamic = 'force-dynamic';
