'use client';

import { useReducer } from 'react';
import Link from 'next/link';
import { createInitialState, gameReducer, type Guess } from '@/lib/game/state';
import { formatGP } from '@/lib/format';

export default function PlayPage() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);

  const onGuess = (guess: Guess) => {
    dispatch({ type: 'guess', guess });
  };

  const onNext = () => {
    dispatch({ type: 'next' });
  };

  const onRestart = () => {
    dispatch({ type: 'restart' });
  };

  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-border flex items-center justify-between border-b px-6 py-4 sm:px-10">
        <Link href="/" className="font-display text-accent">
          partyhat
        </Link>
        <p className="text-text-muted text-sm">
          Streak: <span className="text-text font-semibold">{state.streak}</span>
        </p>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-10">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
          {/* Anchor card */}
          <ItemCard item={state.anchor} priceVisible />

          <p className="font-display text-text-muted text-2xl">vs</p>

          {/* Mystery card */}
          <ItemCard item={state.mystery} priceVisible={state.phase !== 'guessing'} />
        </div>

        {/* Action area \u2014 changes based on phase */}
        {state.phase === 'guessing' && (
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onGuess('higher')}
              className="bg-accent text-bg rounded-md px-8 py-3 font-medium hover:opacity-90"
            >
              ↑ Higher
            </button>
            <button
              type="button"
              onClick={() => onGuess('lower')}
              className="bg-accent text-bg rounded-md px-8 py-3 font-medium hover:opacity-90"
            >
              ↓ Lower
            </button>
          </div>
        )}

        {state.phase === 'revealed' && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-text text-lg">
              ✓ Correct! Streak: <span className="text-accent font-semibold">{state.streak}</span>
            </p>
            <button
              type="button"
              onClick={onNext}
              className="bg-accent text-bg rounded-md px-8 py-3 font-medium hover:opacity-90"
            >
              Next →
            </button>
          </div>
        )}

        {state.phase === 'over' && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-text text-2xl">
              Game over. Final streak:{' '}
              <span className="text-accent font-semibold">{state.streak}</span>
            </p>
            <button
              type="button"
              onClick={onRestart}
              className="bg-accent text-bg rounded-md px-8 py-3 font-medium hover:opacity-90"
            >
              Play again
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

interface ItemCardProps {
  item: { name: string; price: number; iconUrl: string };
  priceVisible: boolean;
}

function ItemCard({ item, priceVisible }: ItemCardProps) {
  return (
    <div className="border-border bg-bg-panel flex w-56 flex-col items-center gap-3 rounded-md border px-6 py-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.iconUrl} alt={item.name} width={48} height={48} className="object-contain" />
      <p className="text-text text-center text-base font-medium">{item.name}</p>
      <p className="text-text-muted h-7 text-lg">
        {priceVisible ? formatGP(item.price) + ' gp' : '???'}
      </p>
    </div>
  );
}
