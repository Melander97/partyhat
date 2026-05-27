/**
 * A single OSRS item with its Grand Exchange price.
 * This is the shape the game consumes \u2014 not necessarily the shape
 * the OSRS Wiki API returns. We'll map API responses to this shape
 * in Phase 2 so the game stays decoupled from the data source.
 */
export interface Item {
  /** Unique OSRS item ID (e.g. 1038 for Red partyhat) */
  id: number;
  /** Display name (e.g. "Red partyhat") */
  name: string;
  /** Current Grand Exchange price in gp */
  price: number;
  /** Full URL to the item icon (hotlinked from OSRS Wiki CDN) */
  iconUrl: string;
  /** Optional examine text \u2014 might use it as a flavor detail later */
  examine?: string;
}
