'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import { GameButton } from '@/components/game/game-button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PlayError({ error, reset }: ErrorPageProps) {
  // Log to the console in dev; in production this would go to a real
  // error tracker like Sentry or Vercel's built-in logging.
  useEffect(() => {
    console.error('Play page error:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden">
      <header className="border-border flex items-center justify-between border-b px-6 py-4 sm:px-10">
        <Link href="/" className="font-display text-accent">
          partyhat
        </Link>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center">
        <h1 className="font-display text-text text-3xl">Something broke.</h1>
        <p className="text-text-muted max-w-md text-base">
          We couldn’t load items for your game right now. This usually fixes itself in a few
          seconds.
        </p>

        <div className="flex gap-3">
          <GameButton type="button" onClick={reset}>
            Try again
          </GameButton>
          <Link href="/" className="text-text-muted hover:text-text self-center text-sm">
            Back to home
          </Link>
        </div>

        {error.digest && (
          <p className="text-text-muted mt-8 text-xs">
            Error ID: <code>{error.digest}</code>
          </p>
        )}
      </section>
    </main>
  );
}
