'use client';

import { useId, useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { GameButton } from '@/components/game/game-button';
import { useClientId } from '@/hooks/use-client-id';
import {
  isRetryableSubmitFailure,
  describeSubmitFailure,
  submitRun,
  SubmitRunError,
} from '@/lib/leaderboard/client';
import { HANDLE_MAX_LENGTH, HANDLE_MIN_LENGTH, validateHandle } from '@/lib/leaderboard/handle';

interface SubmitScoreFormProps {
  /** Signed proof the run ended. Null means there is nothing to submit. */
  receipt: string | null;
  streak: number;
}

type Status =
  | { phase: 'idle' }
  | { phase: 'submitting' }
  | { phase: 'done'; rank: number; handle: string }
  /** Submitting can never succeed for this run (duplicate, expired, ...). */
  | { phase: 'closed'; message: string };

/**
 * Lets a player put a finished run on the global leaderboard. Renders
 * nothing when there is nothing worth submitting: no receipt, or a run that
 * ended on its first guess (the server would reject a streak of 0 anyway).
 */
export function SubmitScoreForm({ receipt, streak }: SubmitScoreFormProps) {
  const prefersReducedMotion = useReducedMotion();
  const { clientId } = useClientId();
  const [handle, setHandle] = useState('');
  const [status, setStatus] = useState<Status>({ phase: 'idle' });
  const [error, setError] = useState<string | null>(null);

  const inputId = useId();
  const hintId = useId();
  const errorId = useId();

  if (receipt === null || streak < 1) return null;

  const submitting = status.phase === 'submitting';

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.phase !== 'idle' || clientId === null || receipt === null) return;

    // Validate here too, so the common mistakes get an instant message
    // instead of a round-trip. The server validates again regardless.
    const validated = validateHandle(handle);
    if (!validated.ok) {
      setError(validated.error);
      return;
    }

    setError(null);
    setStatus({ phase: 'submitting' });

    try {
      const result = await submitRun({ receipt, handle: validated.handle, clientId });
      setStatus({ phase: 'done', rank: result.rank, handle: result.handle });
    } catch (caught) {
      const failureStatus = caught instanceof SubmitRunError ? caught.status : 500;
      const message =
        caught instanceof SubmitRunError ? caught.message : describeSubmitFailure(failureStatus);

      if (isRetryableSubmitFailure(failureStatus)) {
        setError(message);
        setStatus({ phase: 'idle' });
      } else {
        setStatus({ phase: 'closed', message });
      }
    }
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: prefersReducedMotion ? 0.4 : 1.2, duration: 0.4 }}
      className="border-border bg-bg-panel/60 flex w-full max-w-sm flex-col items-center gap-3 rounded-md border px-6 py-4"
    >
      {status.phase === 'done' ? (
        <p role="status" className="text-accent text-center text-base font-semibold">
          You placed #{status.rank} as {status.handle}
        </p>
      ) : status.phase === 'closed' ? (
        <p role="status" className="text-text-muted text-center text-sm">
          {status.message}
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="flex w-full flex-col items-center gap-3">
          <label htmlFor={inputId} className="text-text-muted text-xs tracking-wider uppercase">
            Submit to the leaderboard
          </label>
          <input
            id={inputId}
            type="text"
            value={handle}
            onChange={(event) => setHandle(event.target.value)}
            disabled={submitting}
            maxLength={24}
            autoComplete="off"
            spellCheck={false}
            placeholder="Your name"
            aria-invalid={error !== null}
            aria-describedby={error !== null ? `${hintId} ${errorId}` : hintId}
            className="bg-bg-elevated border-border text-text placeholder:text-text-muted/60 focus-visible:ring-accent/60 focus-visible:ring-offset-bg w-full rounded-md border px-4 py-2.5 text-center text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50"
          />
          <p id={hintId} className="text-text-muted text-center text-xs">
            {HANDLE_MIN_LENGTH}-{HANDLE_MAX_LENGTH} characters: letters, numbers, spaces, _ and -
          </p>
          {error !== null && (
            <p id={errorId} role="alert" className="text-accent-red text-center text-sm">
              {error}
            </p>
          )}
          <GameButton type="submit" variant="secondary" disabled={submitting || clientId === null}>
            {submitting ? 'Submitting…' : 'Submit score'}
          </GameButton>
        </form>
      )}
    </motion.div>
  );
}
