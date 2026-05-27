/**
 * Formats a gp value in OSRS player conventions:
 *  - Under 100,000:        full number with thousands separators ("12,345")
 *  - 100,000 to 999,999:   "K" suffix ("100K", "999K")
 *  - 1,000,000+:           "M" suffix with one decimal ("1.5M", "999.9M")
 *  - 1,000,000,000+:       "B" suffix with one decimal ("2.4B")
 *
 * Matches how OSRS players naturally read prices ("1.5m whip", "100k food").
 */
export function formatGP(amount: number): string {
  if (amount < 100_000) {
    return amount.toLocaleString('en-US');
  }
  if (amount < 1_000_000) {
    return `${Math.floor(amount / 1_000).toLocaleString('en-US')}K`;
  }
  if (amount < 1_000_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `${(amount / 1_000_000_000).toFixed(1)}B`;
}
