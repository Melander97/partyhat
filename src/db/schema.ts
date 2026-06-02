import { pgTable, serial, integer, text, bigint, timestamp, primaryKey } from 'drizzle-orm/pg-core';

/**
 * Item metadata from the OSRS Wiki /mapping endpoint.
 * Static-ish data: an item's name, examine, members status.
 * Refreshed occasionally (weekly at most), not per-request.
 */
export const items = pgTable('items', {
  /** OSRS Item ID, e.g. 1038 for Red partyhat */
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  examine: text('examine'),
  members: integer('members').notNull().default(0), // 0 = free, 1 = members
  iconUrl: text('icon_url').notNull(),
  /** Whether this item should appear in the game pool (filter for tradeables/interesting) */
  inGamePool: integer('in_game_pool').notNull().default(1),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Current price for each item from the OSRS Wiki /latest endpoint.
 * Refreshed on a schedule (every few minutes via Vercel Cron).
 * One row per item; latest snapshot only.
 */
export const prices = pgTable('prices', {
  itemId: integer('item_id')
    .primaryKey()
    .references(() => items.id, { onDelete: 'cascade' }),
  /** Latest "high" trade price in gp (what buyers pay) */
  highPrice: bigint('high_price', { mode: 'number' }),
  /** Latest "low" trade price in gp (what sellers receive) */
  lowPrice: bigint('low_price', { mode: 'number' }),
  /** Timestamp from OSRS Wiki of when this price was recorded */
  observedAt: timestamp('observed_at', { withTimezone: true }),
  /** When our system last updated this row */
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/** Type helpers for query results */
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
export type Price = typeof prices.$inferSelect;
export type NewPrice = typeof prices.$inferInsert;
