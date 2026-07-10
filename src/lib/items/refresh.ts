import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { items } from '@/db/schema';

const MAPPING_URL = 'https://prices.runescape.wiki/api/v1/osrs/mapping';
const ICON_BASE = 'https://oldschool.runescape.wiki/images/';
const USER_AGENT = 'partyhat - https://partyhat-orpin.vercel.app - contact@melander.dev';

interface WikiMappingItem {
  id: number;
  name: string;
  examine?: string;
  members?: boolean;
  icon?: string;
}

function buildIconUrl(iconFilename: string | undefined): string {
  if (!iconFilename) return '';
  return ICON_BASE + iconFilename.replace(/ /g, '_');
}

/**
 * Fetches the OSRS item catalog from the wiki's mapping endpoint
 * and upserts into our items table.
 *
 * Called from both the manual seed script and the scheduled cron endpoint.
 * Idempotent \u2014 running twice in a row is safe.
 */
export async function refreshItems(): Promise<{ written: number }> {
  const response = await fetch(MAPPING_URL, {
    headers: { 'User-Agent': USER_AGENT },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`OSRS mapping API returned HTTP ${response.status}`);
  }

  const wikiItems: WikiMappingItem[] = await response.json();

  if (wikiItems.length === 0) {
    throw new Error('OSRS mapping API returned an empty catalog');
  }

  const rows = wikiItems.map((item) => ({
    id: item.id,
    name: item.name,
    examine: item.examine ?? null,
    members: item.members ? 1 : 0,
    iconUrl: buildIconUrl(item.icon),
    inGamePool: 1,
  }));

  await db
    .insert(items)
    .values(rows)
    .onConflictDoUpdate({
      target: items.id,
      set: {
        name: sql`excluded.name`,
        examine: sql`excluded.examine`,
        members: sql`excluded.members`,
        iconUrl: sql`excluded.icon_url`,
        updatedAt: sql`now()`,
      },
    });

  return { written: rows.length };
}
