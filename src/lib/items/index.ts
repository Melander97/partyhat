import type { Item } from '@/types/item';
import { ITEMS } from './data';

/**
 * Returns a uniformly random item from the dataset.
 */
export function getRandomItem(): Item {
  const index = Math.floor(Math.random() * ITEMS.length);
  // ITEMS is non-empty and index is in bounds, but with
  // noUncheckedIndexedAccess we need to assert non-undefined.
  return ITEMS[index]!;
}

/**
 * Returns a random item from the dataset that is NOT the provided item.
 * Used when picking the next item in the chain \u2014 we never want to compare
 * an item against itself.
 */
export function getRandomItemExcept(excluded: Item): Item {
  // Defensive: if the dataset only has one item, we can't exclude.
  // Won't happen in practice but the type system doesn't know that.
  if (ITEMS.length <= 1) {
    return excluded;
  }

  let candidate = getRandomItem();
  while (candidate.id === excluded.id) {
    candidate = getRandomItem();
  }
  return candidate;
}

/**
 * Returns two distinct random items \u2014 used for the very first round
 * before any chain exists.
 */
export function getRandomPair(): [Item, Item] {
  const first = getRandomItem();
  const second = getRandomItemExcept(first);
  return [first, second];
}

/**
 * Total number of items in the dataset.
 * Exposed for display ("Built from 110 OSRS items").
 */
export const ITEM_COUNT = ITEMS.length;
