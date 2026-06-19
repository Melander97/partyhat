import { getItemPool } from '@/lib/items/db';
import { PlayGame } from './play-game';

export default async function PlayPage() {
  const itemPool = await getItemPool();
  return <PlayGame itemPool={itemPool} />;
}
