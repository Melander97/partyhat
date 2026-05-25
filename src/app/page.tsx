import Link from 'next/link';
import { PartyHatHero } from '@/components/partyhat-hero';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="font-display text-accent text-xl font-semibold tracking-wide">
          partyhat
        </span>
        <ThemeToggle />
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <PartyHatHero />

        <h1 className="font-display mt-8 text-5xl font-bold tracking-tight sm:text-7xl">
          partyhat
        </h1>

        <p className="text-text-muted mt-4 max-w-xl text-lg sm:text-xl">
          Higher or Lower, but with Old School RuneScape items.
        </p>

        <p className="text-text-muted/70 mt-2 text-sm">Coming soon.</p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="https://github.com/Melander97/partyhat"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border bg-bg-panel hover:border-accent hover:text-accent rounded-md border px-6 py-3 text-sm font-medium transition"
          >
            View on GitHub
          </Link>
          <Link
            href="https://alexmelander.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-bg rounded-md border border-transparent px-6 py-3 text-sm font-medium transition hover:opacity-90"
          >
            Built by Alexander Melander
          </Link>
        </div>
      </section>

      <footer className="text-text-muted/60 px-6 py-5 text-center text-xs sm:px-10">
        Not affiliated with Jagex Ltd. OSRS item and price data from the{' '}
        <Link
          href="https://oldschool.runescape.wiki/w/RuneScape:Real-time_Prices"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent underline transition"
        >
          OSRS Wiki Prices API
        </Link>
        .
      </footer>
    </main>
  );
}
