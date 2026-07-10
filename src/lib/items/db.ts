import 'server-only';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { items, prices } from '@/db/schema';
import type { Item } from '@/types/item';

const POOL_SIZE = 50;

/**
 * Fetches a random pool of items for a game session, with current prices.
 *
 * Only returns items that:
 *  - Are members-only (better signal-to-noise than f2p commodity items)
 *  - Are in the game pool
 *  - Have both high and low prices set (i.e., tradeable and recently active)
 *  - Have an average price of at least 100 gp (excludes near-worthless items)
 */
export async function getItemPool(): Promise<Item[]> {
  const rows = await db
    .select({
      id: items.id,
      name: items.name,
      iconUrl: items.iconUrl,
      highPrice: prices.highPrice,
      lowPrice: prices.lowPrice,
    })
    .from(items)
    .innerJoin(prices, sql`${items.id} = ${prices.itemId}`)
    .where(
      sql`${items.members} = 1
        AND ${items.inGamePool} = 1
        AND ${prices.highPrice} IS NOT NULL
        AND ${prices.lowPrice} IS NOT NULL
        AND ((${prices.highPrice} + ${prices.lowPrice}) / 2) >= 100`,
    )
    .orderBy(sql`random()`)
    .limit(POOL_SIZE);

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    // Use the midpoint of high and low as "the price" for Higher/Lower.
    // More stable than either half of the spread.
    price: Math.round(((row.highPrice ?? 0) + (row.lowPrice ?? 0)) / 2),
    iconUrl: row.iconUrl,
  }));
}
