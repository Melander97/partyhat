/**
 * Manually run the item catalog refresh from the command line.
 *
 * Useful for initial data loading, or as a manual override when you need
 * fresh items before the weekly cron runs.
 *
 * Run: npm run db:seed-items
 */
import 'dotenv/config';
import { refreshItems } from '../src/lib/items/refresh';

async function main() {
  console.log('Fetching item mapping from OSRS Wiki...');
  const start = Date.now();
  const result = await refreshItems();
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`Wrote ${result.written} items in ${elapsed}s.`);
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
