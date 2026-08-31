import { NextResponse } from 'next/server';
import { getItemsByIds, getRandomChallenger } from '@/lib/items/db';
import { isGuessCorrect, type Guess } from '@/lib/game/rules';
import {
  issueGuessToken,
  verifyGuessToken,
  InvalidTokenError,
  ExpiredTokenError,
} from '@/lib/game/token';
import type {
  GuessErrorResponse,
  WrongGuessResponse,
  PoolExhaustedResponse,
  CorrectGuessResponse,
} from '@/lib/game/api-types';

interface GuessRequestBody {
  token?: string;
  guess?: string;
}

function isGuess(value: unknown): value is Guess {
  return value === 'higher' || value === 'lower';
}

/**
 * The anti-cheat core of the game. The client sends a direction and its
 * current token; every fact needed to judge the guess — both items' real
 * prices — comes from the database here, never from the request body.
 *
 * On a correct guess, issues a new token for the next round and returns the
 * next mystery item WITHOUT its price, same as /api/game/start.
 * On a wrong guess, returns the final streak + duration — this is what the
 * leaderboard submission route will eventually trust instead of a raw
 * client-supplied number.
 */
export async function POST(request: Request) {
  let body: GuessRequestBody;
  try {
    body = (await request.json()) as GuessRequestBody;
  } catch {
    return NextResponse.json<GuessErrorResponse>({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.token || !isGuess(body.guess)) {
    return NextResponse.json<GuessErrorResponse>(
      { error: 'Body must include token (string) and guess ("higher" | "lower")' },
      { status: 400 },
    );
  }
  const guess = body.guess;

  let payload;
  try {
    payload = verifyGuessToken(body.token);
  } catch (error) {
    if (error instanceof ExpiredTokenError) {
      return NextResponse.json<GuessErrorResponse>(
        { error: 'Run expired — start a new one' },
        { status: 410 },
      );
    }
    if (error instanceof InvalidTokenError) {
      return NextResponse.json<GuessErrorResponse>({ error: 'Invalid token' }, { status: 401 });
    }
    throw error;
  }

  const pairItems = await getItemsByIds([payload.anchorId, payload.mysteryId]);
  const anchorItem = pairItems.find((item) => item.id === payload.anchorId);
  const mysteryItem = pairItems.find((item) => item.id === payload.mysteryId);

  if (!anchorItem || !mysteryItem) {
    // One of the items lost its price (or dropped out of the pool) between
    // /start and this guess — rare, but the run can't be judged fairly.
    return NextResponse.json<GuessErrorResponse>(
      { error: 'One of this run\u2019s items is no longer available — start a new run' },
      { status: 409 },
    );
  }

  const correct = isGuessCorrect(guess, anchorItem.price, mysteryItem.price);

  if (!correct) {
    const durationMs = Date.now() - payload.startedAt;
    return NextResponse.json<WrongGuessResponse>({
      correct: false,
      revealedPrice: mysteryItem.price,
      finalStreak: payload.streak,
      durationMs,
    });
  }

  const newStreak = payload.streak + 1;
  const challenger = await getRandomChallenger(payload.seenItemIds);

  if (!challenger) {
    // Pool exhausted — mirrors the existing client fallback in state.ts's
    // 'next' handler: end the run rather than crash.
    const durationMs = Date.now() - payload.startedAt;
    return NextResponse.json<PoolExhaustedResponse>({
      correct: true,
      poolExhausted: true,
      revealedPrice: mysteryItem.price,
      finalStreak: newStreak,
      durationMs,
    });
  }

  const newToken = issueGuessToken({
    runId: payload.runId,
    anchorId: mysteryItem.id,
    mysteryId: challenger.id,
    streak: newStreak,
    startedAt: payload.startedAt,
    seenItemIds: [...payload.seenItemIds, challenger.id],
  });

  return NextResponse.json<CorrectGuessResponse>({
    correct: true,
    revealedPrice: mysteryItem.price,
    streak: newStreak,
    nextAnchor: mysteryItem,
    nextMystery: { id: challenger.id, name: challenger.name, iconUrl: challenger.iconUrl },
    token: newToken,
  });
}

export const dynamic = 'force-dynamic';
