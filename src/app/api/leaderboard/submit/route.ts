import { NextResponse } from 'next/server';
import { validateHandle } from '@/lib/leaderboard/handle';
import { getRankOfEntry, insertEntry } from '@/lib/leaderboard/db';
import { ExpiredReceiptError, InvalidReceiptError, verifyRunReceipt } from '@/lib/game/receipt';
import type { SubmitErrorResponse, SubmitResponse } from '@/lib/leaderboard/api-types';

/** What useClientId generates: a UUID. Looser than that on purpose, but bounded. */
const CLIENT_ID_PATTERN = /^[A-Za-z0-9-]{8,64}$/;

function fail(error: string, status: number) {
  return NextResponse.json<SubmitErrorResponse>({ error }, { status });
}

/**
 * Turns a finished run into a leaderboard entry.
 *
 * The streak and duration come from the signed receipt, never from the
 * request body, so the only things a player controls here are their handle
 * and which of their own completed runs to submit. Submitting the same
 * run twice is rejected by the unique run id, not by a pre-check.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return fail('Body must be a JSON object', 400);
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return fail('Invalid JSON body', 400);
  }

  const { receipt, handle: rawHandle, clientId } = body;

  if (typeof receipt !== 'string' || receipt.length === 0) {
    return fail('Body must include a receipt (string)', 400);
  }
  if (typeof clientId !== 'string' || !CLIENT_ID_PATTERN.test(clientId)) {
    return fail('Body must include a valid clientId', 400);
  }

  const handleResult = validateHandle(rawHandle);
  if (!handleResult.ok) {
    return fail(handleResult.error, 400);
  }

  let run;
  try {
    run = verifyRunReceipt(receipt);
  } catch (error) {
    if (error instanceof ExpiredReceiptError) {
      return fail('This run is too old to submit', 410);
    }
    if (error instanceof InvalidReceiptError) {
      return fail('Invalid receipt', 401);
    }
    throw error;
  }

  // A run that ended on the very first guess has nothing worth ranking.
  if (run.streak < 1) {
    return fail('A run needs a streak of at least 1 to be submitted', 422);
  }

  const id = await insertEntry({
    runId: run.runId,
    clientId,
    handle: handleResult.handle,
    streak: run.streak,
    durationMs: run.durationMs,
  });

  if (id === null) {
    return fail('This run has already been submitted', 409);
  }

  const rank = await getRankOfEntry({ id, streak: run.streak, durationMs: run.durationMs });

  return NextResponse.json<SubmitResponse>({
    rank,
    handle: handleResult.handle,
    streak: run.streak,
    durationMs: run.durationMs,
  });
}

export const dynamic = 'force-dynamic';
