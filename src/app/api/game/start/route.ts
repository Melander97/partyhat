import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { getStartingPair } from '@/lib/items/db';
import { issueGuessToken } from '@/lib/game/token';

/**
 * Starts a new server-authoritative run: picks an anchor + mystery item,
 * returns the mystery item WITHOUT its price (the whole point \u2014 the client
 * never receives a price it hasn't earned by guessing), and a signed token
 * that verifies the run's state on the next guess.
 */
export async function POST() {
  const pair = await getStartingPair();

  if (!pair) {
    return NextResponse.json({ error: 'No items available to start a run' }, { status: 503 });
  }

  const [anchor, mystery] = pair;
  const startedAt = Date.now();

  const token = issueGuessToken({
    runId: randomUUID(),
    anchorId: anchor.id,
    mysteryId: mystery.id,
    streak: 0,
    startedAt,
    seenItemIds: [anchor.id, mystery.id],
  });

  return NextResponse.json({
    anchor,
    // Mystery item's price is deliberately omitted \u2014 this object has no
    // `price` field at all, not just a hidden one, so there's nothing for
    // React DevTools or the network payload to leak.
    mystery: { id: mystery.id, name: mystery.name, iconUrl: mystery.iconUrl },
    streak: 0,
    token,
  });
}

export const dynamic = 'force-dynamic';
