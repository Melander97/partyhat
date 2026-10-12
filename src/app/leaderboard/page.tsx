import type { Metadata } from 'next';
import Link from 'next/link';

import { formatRunDuration } from '@/lib/format';
import { getTopEntries } from '@/lib/leaderboard/db';

export const metadata: Metadata = {
  title: 'Leaderboard · partyhat',
  description: 'The longest Higher or Lower streaks in partyhat.',
};

// Read on every request so a freshly submitted run shows up straight away.
export const dynamic = 'force-dynamic';

const ENTRY_LIMIT = 50;

export default async function LeaderboardPage() {
  const entries = await getTopEntries(ENTRY_LIMIT);

  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden">
      <header className="border-border flex items-center justify-between border-b px-6 py-4 sm:px-10">
        <Link href="/" className="font-display text-accent">
          partyhat
        </Link>
        <Link href="/play" className="text-text-muted hover:text-accent text-sm transition">
          Play →
        </Link>
      </header>

      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-display text-text text-3xl">Leaderboard</h1>
          <p className="text-text-muted text-sm">Longest streak wins. Ties go to the faster run.</p>
        </div>

        {entries.length === 0 ? (
          <div className="border-border bg-bg-panel/60 flex flex-col items-center gap-3 rounded-md border px-6 py-10 text-center">
            <p className="text-text-muted text-base">No runs yet. Be the first on the board.</p>
            <Link
              href="/play"
              className="bg-accent text-bg rounded-md px-6 py-2.5 text-sm font-semibold transition hover:opacity-90"
            >
              Play partyhat →
            </Link>
          </div>
        ) : (
          <div className="border-border bg-bg-panel/60 overflow-hidden rounded-md border">
            <table className="w-full text-left">
              <caption className="sr-only">Top {ENTRY_LIMIT} runs by streak, then by time</caption>
              <thead>
                <tr className="border-border text-text-muted border-b text-xs tracking-wider uppercase">
                  <th scope="col" className="w-14 px-4 py-3 font-normal">
                    Rank
                  </th>
                  <th scope="col" className="px-2 py-3 font-normal">
                    Player
                  </th>
                  <th scope="col" className="px-2 py-3 text-right font-normal">
                    Streak
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-normal">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => {
                  const rank = index + 1;
                  return (
                    <tr
                      key={`${rank}-${entry.handle}`}
                      className="border-border/50 border-b last:border-b-0"
                    >
                      <td
                        className={`px-4 py-3 tabular-nums ${rank <= 3 ? 'text-accent font-semibold' : 'text-text-muted'}`}
                      >
                        {rank}
                      </td>
                      <td className="text-text max-w-0 truncate px-2 py-3">{entry.handle}</td>
                      <td className="text-text px-2 py-3 text-right font-semibold tabular-nums">
                        {entry.streak}
                      </td>
                      <td className="text-text-muted px-4 py-3 text-right tabular-nums">
                        {formatRunDuration(entry.durationMs)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
