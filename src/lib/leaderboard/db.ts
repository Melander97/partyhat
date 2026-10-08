import 'server-only';
import { asc, desc } from 'drizzle-orm';
import { db } from '@/db';
import { leaderboardEntries } from '@/db/schema';

/**
 * The top leaderboard entries, best first: highest streak wins, and among
 * equal streaks the faster run wins. If those tie too, the earlier
 * submission (lower id) ranks higher, which keeps the ordering fully
 * deterministic between polls.
 *
 * Only selects the columns the public leaderboard exposes. `clientId` and
 * `runId` are never read here, so they can't leak through this path even
 * by accident.
 */
export async function getTopEntries(limit: number) {
  return db
    .select({
      handle: leaderboardEntries.handle,
      streak: leaderboardEntries.streak,
      durationMs: leaderboardEntries.durationMs,
      createdAt: leaderboardEntries.createdAt,
    })
    .from(leaderboardEntries)
    .orderBy(
      desc(leaderboardEntries.streak),
      asc(leaderboardEntries.durationMs),
      asc(leaderboardEntries.id),
    )
    .limit(limit);
}
