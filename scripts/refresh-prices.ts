import 'dotenv/config';
import { refreshPrices } from '../src/lib/prices/refresh';

async function main() {
  console.log('Refreshing prices from OSRS Wiki...');
  const start = Date.now();
  const result = await refreshPrices();
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(
    `Wrote ${result.written} price rows, skipped ${result.skipped} unknown items. Took ${elapsed}s.`,
  );
}

main().catch((error) => {
  console.error('Refresh failed:', error);
  process.exit(1);
});
