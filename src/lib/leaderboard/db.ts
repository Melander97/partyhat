import 'server-only';
import { and, asc, count, desc, eq, gt, lt, or } from 'drizzle-orm';
import { db } from '@/db';
import { leaderboardEntries, type NewLeaderboardEntry } from '@/db/schema';

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

/**
 * Inserts a submitted run. Returns the new row's id, or null if a row with
 * the same runId already exists.
 *
 * Relies on the UNIQUE constraint on run_id rather than a "check, then
 * insert" pair: two simultaneous submissions of the same receipt can both
 * pass a check, but only one can win the insert. ON CONFLICT DO NOTHING
 * makes the loser a clean null instead of a thrown database error.
 */
export async function insertEntry(entry: NewLeaderboardEntry): Promise<number | null> {
  const inserted = await db
    .insert(leaderboardEntries)
    .values(entry)
    .onConflictDoNothing({ target: leaderboardEntries.runId })
    .returning({ id: leaderboardEntries.id });

  return inserted[0]?.id ?? null;
}

/**
 * The 1-based rank of a stored entry: one more than the number of entries
 * that sort strictly ahead of it. Uses exactly the same ordering as
 * getTopEntries (streak desc, duration asc, id asc), so the rank returned
 * on submit always agrees with the position shown on the leaderboard.
 */
export async function getRankOfEntry(entry: {
  id: number;
  streak: number;
  durationMs: number;
}): Promise<number> {
  const [row] = await db
    .select({ ahead: count() })
    .from(leaderboardEntries)
    .where(
      or(
        gt(leaderboardEntries.streak, entry.streak),
        and(
          eq(leaderboardEntries.streak, entry.streak),
          lt(leaderboardEntries.durationMs, entry.durationMs),
        ),
        and(
          eq(leaderboardEntries.streak, entry.streak),
          eq(leaderboardEntries.durationMs, entry.durationMs),
          lt(leaderboardEntries.id, entry.id),
        ),
      ),
    );

  return (row?.ahead ?? 0) + 1;
}
