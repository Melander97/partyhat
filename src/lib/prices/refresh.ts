import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { items, prices } from '@/db/schema';

const LATEST_URL = 'https://prices.runescape.wiki/api/v1/osrs/latest';
const USER_AGENT = 'partyhat - https://partyhat-orpin.vercel.app - contact@melander.dev';

interface WikiLatestEntry {
  high: number | null;
  highTime: number | null;
  low: number | null;
  lowTime: number | null;
}

interface WikiLatestResponse {
  data: Record<string, WikiLatestEntry>;
}

/**
 * Fetches the latest prices from the OSRS Wiki and upserts them into the DB.
 * Returns the number of price rows written and the number skipped.
 *
 * Skips prices for items that don't exist in the items table \u2014 the /latest
 * endpoint returns some items that aren't in /mapping, and inserting those
 * would violate the foreign key constraint.
 */
export async function refreshPrices(): Promise<{
  written: number;
  skipped: number;
}> {
  const response = await fetch(LATEST_URL, {
    headers: { 'User-Agent': USER_AGENT },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`OSRS API returned HTTP ${response.status}`);
  }

  const payload = (await response.json()) as WikiLatestResponse;
  const entries = Object.entries(payload.data);

  if (entries.length === 0) {
    throw new Error('OSRS API returned an empty data set');
  }

  // Fetch the set of known item IDs so we can skip prices for items
  // that aren't in our items table (which would violate the FK constraint).
  const knownItems = await db.select({ id: items.id }).from(items);
  const knownItemIds = new Set(knownItems.map((row) => row.id));

  // Transform, filter out items with no price data AND items we don't know about
  const allCandidates = entries
    .filter(([, entry]) => entry.high !== null || entry.low !== null)
    .map(([itemIdStr, entry]) => ({
      itemId: parseInt(itemIdStr, 10),
      highPrice: entry.high,
      lowPrice: entry.low,
      observedAt: entry.highTime
        ? new Date(entry.highTime * 1000)
        : entry.lowTime
          ? new Date(entry.lowTime * 1000)
          : null,
    }));

  const rows = allCandidates.filter((row) => knownItemIds.has(row.itemId));
  const skipped = allCandidates.length - rows.length;

  if (rows.length === 0) {
    return { written: 0, skipped };
  }

  await db
    .insert(prices)
    .values(rows)
    .onConflictDoUpdate({
      target: prices.itemId,
      set: {
        highPrice: sql`excluded.high_price`,
        lowPrice: sql`excluded.low_price`,
        observedAt: sql`excluded.observed_at`,
        updatedAt: sql`now()`,
      },
    });

  return { written: rows.length, skipped };
}
