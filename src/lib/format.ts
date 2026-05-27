/**
 * Formats a gp value in OSRS conventions:
 *  - Up to 99,999: full number with thousands separators (e.g. "12,345")
 *  - 100,000 to 9,999,999: "K" suffix (e.g. "100K", "1,200K")
 *  - 10,000,000 and up: "M" suffix (e.g. "10M", "1,500M")
 *  - 1,000,000,000 and up: "B" suffix (e.g. "2.4B")
 *
 * This matches how OSRS players naturally read prices.
 */
export function formatGP(amount: number): string {
  if (amount < 100_000) {
    return amount.toLocaleString('en-US');
  }
  if (amount < 10_000_000) {
    return `${Math.floor(amount / 1_000).toLocaleString('en-US')}K`;
  }
  if (amount < 1_000_000_000) {
    return `${Math.floor(amount / 1_000_000).toLocaleString('en-US')}M`;
  }
  return `${(amount / 1_000_000_000).toFixed(1)}B`;
}
