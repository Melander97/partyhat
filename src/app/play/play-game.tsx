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
import {
  createInitialState,
  gameReducer,
  getStreakComment,
  type GameState,
  type Guess,
} from '@/lib/game/state';
import type { Run } from '@/lib/records/types';
import type { Item } from '@/types/item';

interface PlayGameProps {
  /** Initial pool of items for this session. Reserved for branch 2.3 step 3 \u2014 currently unused. */
  itemPool: Item[];
}

export function PlayGame({ itemPool }: PlayGameProps) {
  const [state, dispatch] = useReducer(gameReducer, null as GameState | null, () => null);
  const [mounted, setMounted] = useState(false);

  const { records, saveRun, lastResult, mounted: recordsMounted } = useRecords();

  useEffect(() => {
    dispatch({ type: 'restart', pool: itemPool });
    setMounted(true);
  }, [itemPool]);

  const onGuess = (guess: Guess) => {
    dispatch({ type: 'guess', guess });
  };

  const onNext = () => {
    dispatch({ type: 'next' });
  };

  const onRestart = () => {
    dispatch({ type: 'restart', pool: itemPool });
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

      <section className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-10">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
          <AnimatePresence mode="popLayout" initial={false}>
            <ItemCard key={`anchor-${state.anchor.id}`} item={state.anchor} priceVisible />
          </AnimatePresence>

          <p className="font-display text-text-muted text-2xl">vs</p>

          <AnimatePresence mode="popLayout" initial={false}>
            <ItemCard
              key={`mystery-${state.mystery.id}`}
              item={state.mystery}
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
            <GameButton type="button" onClick={() => onGuess('higher')}>
              ↑ Higher
            </GameButton>
            <GameButton type="button" onClick={() => onGuess('lower')}>
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
            records={records}
            recordsMounted={recordsMounted}
            lastResult={lastResult}
            onRestart={onRestart}
          />
        )}
      </section>
    </main>
  );
}

interface GameOverBlockProps {
  streak: number;
  records: ReturnType<typeof useRecords>['records'];
  recordsMounted: boolean;
  lastResult: ReturnType<typeof useRecords>['lastResult'];
  onRestart: () => void;
}

function GameOverBlock({
  streak,
  records,
  recordsMounted,
  lastResult,
  onRestart,
}: GameOverBlockProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: prefersReducedMotion ? 0.2 : 0.6,
        duration: prefersReducedMotion ? 0.2 : 0.3,
      }}
      className="flex flex-col items-center gap-5"
    >
      <VerdictBadge correct={false} />

      <div className="flex flex-col items-center gap-1">
        <p className="text-text-muted text-sm tracking-wider uppercase">Final streak</p>
        <FinalStreakNumber value={streak} />
        <p className="text-text-muted mt-1 text-base">{getStreakComment(streak)}</p>
      </div>

      {recordsMounted && <RecordsDisplay records={records} newRecord={lastResult} />}

      <GameButton
        type="button"
        onClick={onRestart}
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={
          prefersReducedMotion
            ? { delay: 0.4, duration: 0.2 }
            : { delay: 1.0, type: 'spring', stiffness: 200, damping: 20 }
        }
      >
        Play again
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
