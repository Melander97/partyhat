import 'server-only';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { items } from '@/db/schema';
import type { Item } from '@/types/item';

/** How many items each session pre-fetches. ~50 = enough for any single session. */
const POOL_SIZE = 50;

/**
 * Fetches a random pool of items for a game session.
 * Filters to members-only items by default (better signal-to-noise than f2p
 * arrowtips and starter gear).
 *
 * Returns items in the shape the game expects (matches our existing Item type).
 */
export async function getItemPool(): Promise<Item[]> {
  const rows = await db
    .select({
      id: items.id,
      name: items.name,
      iconUrl: items.iconUrl,
    })
    .from(items)
    .where(sql`${items.members} = 1 AND ${items.inGamePool} = 1`)
    .orderBy(sql`random()`)
    .limit(POOL_SIZE);

  // Until we have prices in the DB (branch 2.4), use a placeholder.
  // The game type expects a `price` field, so we satisfy the contract.
  // This will be replaced with real prices once branch 2.4 lands.
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    price: 0, // placeholder until prices are seeded
    iconUrl: row.iconUrl,
  }));
}
