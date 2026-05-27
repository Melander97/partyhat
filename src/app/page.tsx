import Link from 'next/link';
import { PartyHatHero } from '@/components/partyhat-hero';
import { PartyhatRow } from '@/components/partyhat-row';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="font-display text-accent text-xl font-semibold tracking-wide">
          partyhat
        </span>
        <ThemeToggle />
      </header>

      <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
        {/* Radial gold glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 215, 0, 0.12) 0%, rgba(255, 215, 0, 0.04) 35%, transparent 70%)',
          }}
        />

        <PartyHatHero />

        <div className="mt-10">
          <PartyhatRow />
        </div>

        <h1 className="font-display mt-12 text-5xl font-bold tracking-tight sm:text-7xl">
          partyhat
        </h1>

        <p className="text-text-muted mt-4 max-w-xl text-lg sm:text-xl">
          Higher or Lower, but with Old School RuneScape items.
        </p>

        <p className="text-text-muted mt-2 text-sm">Coming soon.</p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/play"
            className="bg-accent text-bg rounded-md border border-transparent px-8 py-3 text-sm font-semibold transition hover:opacity-90"
          >
            Play partyhat →
          </Link>
          <Link
            href="https://github.com/Melander97/partyhat"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border bg-bg-panel hover:border-accent hover:text-accent rounded-md border px-6 py-3 text-sm font-medium transition"
          >
            View on GitHub
          </Link>
        </div>
      </section>

      <footer className="text-text-muted px-6 py-5 text-center text-xs sm:px-10">
        <p>
          Built by{' '}
          <Link
            href="https://alexmelander.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent underline transition"
          >
            Alexander Melander
          </Link>
          {' \u00b7 '}
          Not affiliated with Jagex Ltd. Item and price data from the{' '}
          <Link
            href="https://oldschool.runescape.wiki/w/RuneScape:Real-time_Prices"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent underline transition"
          >
            OSRS Wiki Prices API
          </Link>
          .
        </p>
      </footer>
    </main>
  );
}
