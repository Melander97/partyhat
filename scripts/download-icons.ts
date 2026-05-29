/**
 * One-time script to download all OSRS item icons from the wiki to /public/items/.
 *
 * Why: The OSRS Wiki domain is blocked on many corporate networks and content
 * filters, which would break our images for those users. By bundling them
 * locally, we serve them from our own Vercel domain alongside the rest of the
 * site.
 *
 * Run: npx tsx scripts/download-icons.ts
 *
 * Idempotent: skips items whose files already exist.
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { ITEMS } from '../src/lib/items/data';

const OUTPUT_DIR = join(process.cwd(), 'public', 'items');
const USER_AGENT = 'partyhat - https://partyhat-orpin.vercel.app - contact@melander.dev';

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function downloadIcon(item: (typeof ITEMS)[number]): Promise<void> {
  const filename = `${item.id}.png`;
  const outputPath = join(OUTPUT_DIR, filename);

  if (await fileExists(outputPath)) {
    console.log(`\u2713 ${item.name} (already exists)`);
    return;
  }

  const response = await fetch(item.iconUrl, {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (!response.ok) {
    console.warn(`\u2717 ${item.name} - HTTP ${response.status}`);
    return;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, buffer);
  console.log(`\u2193 ${item.name} -> ${filename}`);
}

async function main() {
  console.log(`Downloading ${ITEMS.length} item icons to ${OUTPUT_DIR}\n`);

  await mkdir(OUTPUT_DIR, { recursive: true });

  // Run sequentially with a tiny delay to be polite to the wiki's servers.
  // Parallel would be faster but rude. The wiki staff have explicitly asked
  // for considerate use in their API docs.
  for (const item of ITEMS) {
    await downloadIcon(item);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log('\nDone.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
