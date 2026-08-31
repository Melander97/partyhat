'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useReducer, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { FinalStreakNumber } from '@/components/game/final-streak-number';
import { GameButton } from '@/components/game/game-button';
import { RecordsDisplay } from '@/components/game/records-display';
import { RevealedPrice } from '@/components/game/revealed-price';
import { RunTimer } from '@/components/game/run-timer';
import { VerdictBadge } from '@/components/game/verdict-badge';
import { useRecords } from '@/hooks/use-records';
import { formatGP } from '@/lib/format';
import { GameApiError, RunExpiredError, startRun, submitGuess } from '@/lib/game/client';
import { gameReducer, getStreakComment, type GameState, type Guess } from '@/lib/game/state';
import type { Run } from '@/lib/records/types';
import type { Item } from '@/types/item';

export function PlayGame() {
  const [state, dispatch] = useReducer(gameReducer, null as GameState | null, () => null);
  const [mounted, setMounted] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const [fatalError, setFatalError] = useState<Error | null>(null);

  const { records, saveRun, lastResult, mounted: recordsMounted } = useRecords();

  // Boots a fresh run from the server. Used on first mount and for "Play
  // again" — both cases want a brand-new streak-0 run.
  const boot = async (notice?: string) => {
    try {
      const data = await startRun();
      dispatch({
        type: 'started',
        anchor: data.anchor,
        mystery: data.mystery,
        token: data.token,
        notice,
      });
    } catch (error) {
      setFatalError(error instanceof Error ? error : new Error('Failed to start a new run'));
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await boot();
      if (!cancelled) setMounted(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onGuess = async (guess: Guess) => {
    if (!state || state.phase !== 'guessing' || state.submitting) return;

    dispatch({ type: 'guessSubmitted', guess });
    try {
      const result = await submitGuess(state.token, guess);
      dispatch({ type: 'guessResolved', result });
    } catch (error) {
      if (error instanceof RunExpiredError) {
        await boot('Your run timed out from inactivity — started a new one.');
        return;
      }
      setFatalError(
        error instanceof GameApiError || error instanceof Error
          ? error
          : new Error('Failed to submit guess'),
      );
    }
  };

  const onNext = () => {
    dispatch({ type: 'next' });
  };

  const onRestart = async () => {
    setRestarting(true);
    await boot();
    setRestarting(false);
  };

  useEffect(() => {
    if (state?.phase !== 'over') return;
    if (state.finalElapsedMs === null) return;

    const run: Run = {
      streak: state.streak,
      timeMs: state.finalElapsedMs,
    };

    saveRun(run);
  }, [state?.phase, state?.finalElapsedMs, state?.streak, saveRun]);

  // Auto-dismiss the idle-restart notice after a few seconds.
  useEffect(() => {
    if (!state?.notice) return;
    const timeout = setTimeout(() => dispatch({ type: 'dismissNotice' }), 5000);
    return () => clearTimeout(timeout);
  }, [state?.notice]);

  if (fatalError) {
    // Surfaces to the nearest error boundary (src/app/play/error.tsx) —
    // this only happens for genuinely unexpected conditions (network
    // failure, a tampered/invalid token, no items available at all), not
    // the expected idle-timeout case, which is handled by boot() above.
    throw fatalError;
  }

  if (!mounted || state === null) {
    return (
      <main className="flex min-h-screen flex-col overflow-x-hidden">
        <header className="border-border flex items-center justify-between border-b px-6 py-4 sm:px-10">
          <Link href="/" className="font-display text-accent">
            partyhat
          </Link>
        </header>
        <section className="flex flex-1 items-center justify-center">
          <p className="text-text-muted">Loading game…</p>
        </section>
      </main>
    );
  }

  const mysteryDisplayItem: Item = { ...state.mystery, price: state.revealedPrice ?? 0 };

  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden">
      <header className="border-border flex items-center justify-between border-b px-6 py-4 sm:px-10">
        <Link href="/" className="font-display text-accent">
          partyhat
        </Link>
        <div className="flex items-center gap-5">
          <RunTimer startedAt={state.startedAt} finalElapsedMs={state.finalElapsedMs} />
          <p className="text-text-muted text-sm">
            Streak: <span className="text-text font-semibold">{state.streak}</span>
          </p>
        </div>
      </header>

      <AnimatePresence>
        {state.notice && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-accent/10 text-accent px-6 py-2 text-center text-sm"
          >
            {state.notice}
          </motion.p>
        )}
      </AnimatePresence>

      <section className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-10">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
          <AnimatePresence mode="popLayout" initial={false}>
            <ItemCard key={`anchor-${state.anchor.id}`} item={state.anchor} priceVisible />
          </AnimatePresence>

          <p className="font-display text-text-muted text-2xl">vs</p>

          <AnimatePresence mode="popLayout" initial={false}>
            <ItemCard
              key={`mystery-${state.mystery.id}`}
              item={mysteryDisplayItem}
              priceVisible={state.phase !== 'guessing'}
              animatePrice
              verdict={
                state.phase === 'guessing' ? null : state.lastGuessCorrect ? 'correct' : 'wrong'
              }
            />
          </AnimatePresence>
        </div>

        {state.phase === 'guessing' && (
          <div className="flex gap-4">
            <GameButton type="button" disabled={state.submitting} onClick={() => onGuess('higher')}>
              ↑ Higher
            </GameButton>
            <GameButton type="button" disabled={state.submitting} onClick={() => onGuess('lower')}>
              ↓ Lower
            </GameButton>
          </div>
        )}

        {state.phase === 'revealed' && (
          <div className="flex flex-col items-center gap-4">
            <VerdictBadge correct />
            <p className="text-text-muted text-sm">
              Streak: <span className="text-accent font-semibold">{state.streak}</span>
            </p>
            <GameButton type="button" onClick={onNext}>
              Next →
            </GameButton>
          </div>
        )}

        {state.phase === 'over' && (
          <GameOverBlock
            streak={state.streak}
            won={state.wonByExhaustion}
            records={records}
            recordsMounted={recordsMounted}
            lastResult={lastResult}
            onRestart={onRestart}
            restarting={restarting}
          />
        )}
      </section>
    </main>
  );
}

interface GameOverBlockProps {
  streak: number;
  won: boolean;
  records: ReturnType<typeof useRecords>['records'];
  recordsMounted: boolean;
  lastResult: ReturnType<typeof useRecords>['lastResult'];
  onRestart: () => void;
  restarting: boolean;
}

function GameOverBlock({
  streak,
  won,
  records,
  recordsMounted,
  lastResult,
  onRestart,
  restarting,
}: GameOverBlockProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        // Shortened from the original 0.6s/0.3s — a real network wait now
        // happens before this phase is even reached, so that already
        // supplies a "beat" and doesn't need as much added on top.
        delay: prefersReducedMotion ? 0.2 : 0.2,
        duration: prefersReducedMotion ? 0.2 : 0.2,
      }}
      className="flex flex-col items-center gap-5"
    >
      <VerdictBadge correct={won} />

      <div className="flex flex-col items-center gap-1">
        <p className="text-text-muted text-sm tracking-wider uppercase">Final streak</p>
        <FinalStreakNumber value={streak} />
        <p className="text-text-muted mt-1 text-base">
          {won ? 'You cleared the entire item pool!' : getStreakComment(streak)}
        </p>
      </div>

      {recordsMounted && <RecordsDisplay records={records} newRecord={lastResult} />}

      <GameButton
        type="button"
        onClick={onRestart}
        disabled={restarting}
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={
          prefersReducedMotion
            ? { delay: 0.4, duration: 0.2 }
            : { delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }
        }
      >
        {restarting ? 'Starting…' : 'Play again'}
      </GameButton>
    </motion.div>
  );
}

interface ItemCardProps {
  item: Item;
  priceVisible: boolean;
  animatePrice?: boolean;
  verdict?: 'correct' | 'wrong' | null;
}

function ItemCard({ item, priceVisible, animatePrice = false, verdict = null }: ItemCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const verdictBorderClass =
    verdict === 'correct'
      ? 'border-green-500/40 shadow-[0_0_24px_rgba(34,197,94,0.15)]'
      : verdict === 'wrong'
        ? 'border-red-500/40 shadow-[0_0_24px_rgba(239,68,68,0.15)]'
        : 'border-border';

  return (
    <motion.div
      layout={!prefersReducedMotion}
      layoutId={prefersReducedMotion ? undefined : `card-${item.id}`}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 60, scale: 0.95 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -60, scale: 0.95 }}
      transition={
        prefersReducedMotion ? { duration: 0.2 } : { type: 'spring', stiffness: 280, damping: 28 }
      }
      className={`bg-bg-panel flex w-56 flex-col items-center gap-3 rounded-md border px-6 py-6 transition-all duration-500 ${verdictBorderClass}`}
    >
      <ItemIcon key={item.id} iconUrl={item.iconUrl} name={item.name} />
      <p className="text-text text-center text-base font-medium">{item.name}</p>
      <p className="text-text-muted h-7 text-lg">
        {priceVisible ? (
          animatePrice ? (
            <RevealedPrice key={item.id} value={item.price} />
          ) : (
            formatGP(item.price) + ' gp'
          )
        ) : (
          '???'
        )}
      </p>
    </motion.div>
  );
}

function ItemIcon({ iconUrl, name }: { iconUrl: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed) {
    return (
      <div
        className="bg-bg-elevated text-text-muted flex h-12 w-12 items-center justify-center rounded"
        aria-label={`${name} (image unavailable)`}
      >
        <span className="font-display text-xl">?</span>
      </div>
    );
  }

  return (
    <div className="relative h-12 w-12">
      {!loaded && (
        <div className="bg-bg-elevated absolute inset-0 animate-pulse rounded" aria-hidden="true" />
      )}
      <Image
        src={iconUrl}
        alt={name}
        width={48}
        height={48}
        className={`h-12 w-12 object-contain transition-opacity duration-200 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
