/**
 * Pulls the full OSRS item catalog from the wiki's mapping endpoint
 * and seeds our items table.
 *
 * Idempotent: re-running updates existing items, inserts new ones.
 * Designed to be re-run periodically (weekly or so) to catch new items
 * the OSRS team has added.
 *
 * Run: npx tsx scripts/seed-items.ts
 */
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { items } from '../src/db/schema';
import { sql as dsql } from 'drizzle-orm';

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
  // Spaces in icon filenames become underscores in the URL
  return ICON_BASE + iconFilename.replace(/ /g, '_');
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  console.log('Fetching item mapping from OSRS Wiki...');

  const response = await fetch(MAPPING_URL, {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch mapping: HTTP ${response.status}`);
  }

  const wikiItems: WikiMappingItem[] = await response.json();
  console.log(`Received ${wikiItems.length} items from the wiki.`);

  // Connect to the database
  const client = neon(process.env.DATABASE_URL);
  const db = drizzle(client, { schema: { items } });

  // Transform wiki data to our schema shape
  const rows = wikiItems.map((item) => ({
    id: item.id,
    name: item.name,
    examine: item.examine ?? null,
    members: item.members ? 1 : 0,
    iconUrl: buildIconUrl(item.icon),
    inGamePool: 1, // default: include everything; we'll filter later
  }));

  console.log(`Inserting ${rows.length} items into the database...`);

  // Insert with conflict handling: if an item already exists (by id),
  // update its fields instead of failing.
  // This is Postgres' "ON CONFLICT" / "upsert" pattern.
  await db
    .insert(items)
    .values(rows)
    .onConflictDoUpdate({
      target: items.id,
      set: {
        name: dsql`excluded.name`,
        examine: dsql`excluded.examine`,
        members: dsql`excluded.members`,
        iconUrl: dsql`excluded.icon_url`,
        updatedAt: dsql`now()`,
      },
    });

  console.log('Done.');
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
