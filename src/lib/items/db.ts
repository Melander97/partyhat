import 'server-only';
import { and, inArray, notInArray, sql } from 'drizzle-orm';
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

/**
 * Picks two random distinct items to start a new run: the anchor (shown
 * with its price) and the mystery item (price withheld until guessed).
 * Same pool filters as getItemPool, just limited to 2 rows in one query.
 */
export async function getStartingPair(): Promise<[Item, Item] | null> {
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
    .limit(2);

  if (rows.length < 2) return null;

  const [anchorRow, mysteryRow] = rows as [(typeof rows)[0], (typeof rows)[0]];
  const toItem = (row: (typeof rows)[0]): Item => ({
    id: row.id,
    name: row.name,
    price: Math.round(((row.highPrice ?? 0) + (row.lowPrice ?? 0)) / 2),
    iconUrl: row.iconUrl,
  });

  return [toItem(anchorRow), toItem(mysteryRow)];
}

/**
 * Fetches specific items by id with their current price. Used by the guess
 * route to look up the *real* price for a run's anchor/mystery pair \u2014 the
 * server never trusts a price the client claims.
 *
 * Returns fewer rows than requested if an id no longer has a price (e.g. a
 * weekly item refresh dropped it mid-run) \u2014 callers must check length.
 */
export async function getItemsByIds(ids: number[]): Promise<Item[]> {
  if (ids.length === 0) return [];

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
      and(
        inArray(items.id, ids),
        sql`${prices.highPrice} IS NOT NULL AND ${prices.lowPrice} IS NOT NULL`,
      ),
    );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    price: Math.round(((row.highPrice ?? 0) + (row.lowPrice ?? 0)) / 2),
    iconUrl: row.iconUrl,
  }));
}

/**
 * Picks one random item for the next challenger, using the same pool
 * filters as getItemPool, excluding ids already seen this run so a run
 * never repeats an item.
 *
 * Returns null if the pool is exhausted (extremely unlikely given ~4,500
 * items, but the guess route must handle it rather than crash).
 */
export async function getRandomChallenger(excludeIds: number[]): Promise<Item | null> {
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
      and(
        sql`${items.members} = 1
          AND ${items.inGamePool} = 1
          AND ${prices.highPrice} IS NOT NULL
          AND ${prices.lowPrice} IS NOT NULL
          AND ((${prices.highPrice} + ${prices.lowPrice}) / 2) >= 100`,
        ...(excludeIds.length > 0 ? [notInArray(items.id, excludeIds)] : []),
      ),
    )
    .orderBy(sql`random()`)
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    price: Math.round(((row.highPrice ?? 0) + (row.lowPrice ?? 0)) / 2),
    iconUrl: row.iconUrl,
  };
}
